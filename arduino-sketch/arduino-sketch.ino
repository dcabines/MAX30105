#include <Wire.h>
#include "MAX30105.h"
// https://github.com/sparkfun/SparkFun_MAX3010x_Sensor_Library

MAX30105 sensor;

void setup()
{
  Serial.begin(9600);

  if (!sensor.begin())
  {
    Serial.println("MAX30105 was not found.");
    while (1);
  }

  sensor.setup();
}

void loop()
{
  Serial.print("{ ");

  Serial.print("\"red\":");
  Serial.print(sensor.getRed());
  Serial.print(", ");

  Serial.print("\"ir\":");
  Serial.print(sensor.getIR());
  Serial.print(", ");

  Serial.print("\"green\":");
  Serial.print(sensor.getGreen());

  Serial.print(" }");

  Serial.println();
}
