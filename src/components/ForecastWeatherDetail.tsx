import React from "react";
import Container from "./Container";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {}

export default function ForecastWeatherDetail({}: Props) {
  return (
    <Container className="flex flex-col gap-4 w-full">
      <p className="text-2xl">Previsão (7 dias)</p>
      {/* Add your forecast weather details here */}
    </Container>
  );
}