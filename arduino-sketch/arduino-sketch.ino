#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
// https://github.com/sparkfun/SparkFun_MAX3010x_Sensor_Library

MAX30105 sensor;

const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute;
int beatAvg;

void setup()
{
  Serial.begin(9600);

  if (!sensor.begin())
  {
    Serial.println("MAX30105 was not found.");
    while (1);
  }

  sensor.setup();
  sensor.setPulseAmplitudeRed(0x0A);
  sensor.setPulseAmplitudeGreen(0);
}

void loop()
{
  long irValue = sensor.getIR();

  if (checkForBeat(irValue) == true)
  {
    //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute;
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
    }
  }
  
  Serial.print("{ ");

  Serial.print("\"red\":");
  Serial.print(sensor.getRed());
  Serial.print(", ");

  Serial.print("\"ir\":");
  Serial.print(irValue);
  Serial.print(", ");

  Serial.print("\"green\":");
  Serial.print(sensor.getGreen());
  Serial.print(", ");

  Serial.print("\"beat\":");
  Serial.print(checkForBeat(irValue));
  Serial.print(", ");

  Serial.print("\"bpm\":");
  Serial.print(beatsPerMinute);
  Serial.print(", ");

  Serial.print("\"beatAvg\":");
  Serial.print(beatAvg);

  Serial.print(" }");

  Serial.println();
}
