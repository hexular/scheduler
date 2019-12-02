import React from "react";
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect'; 
import {  render, 
          cleanup, 
          waitForElement, 
          fireEvent, 
          getByText,
          prettyDOM,
          getAllByTestId,
          getByAltText,
          getByPlaceholderText,
          getByTestId,
          queryByText
        } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    // console.log(prettyDOM(appointments));
    const appointment = getAllByTestId(container, "appointment")[0];
    // console.log(prettyDOM(container));
    // console.log('first app', prettyDOM(appointment));

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Dan"}
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving interview")).toBeInTheDocument();
    // expect(getByTestId(appointments[1], "appointment").toHaveValue("Saving"))
    // await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find(day =>
      getByText(queryByText(day, "Monday"), "no appointments remaining").toBeInTheDocument()
    );
    
    console.log(prettyDOM(day));
  });

});