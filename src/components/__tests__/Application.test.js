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


    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Dan"}
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving interview")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    // expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Press confirm to remove this interview")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    
    await expect(getByText(appointment, "Cancelling interview")).toBeInTheDocument()

    expect(getByAltText(appointment, "Add")).toBeInTheDocument();
    
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    // expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

     const { container, debug } = render(<Application />);
  
     await waitForElement(() => getByText(container, "Archie Cohen"));
 
     const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Edit"));

    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving interview")).toBeInTheDocument();

    await expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    // expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", () => {
    axios.put.mockRejectedValueOnce();
  });

  it("shows the save error when failing to save an appointment"), async () => {
    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));


    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Dan"}
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving interview")).toBeInTheDocument();

    await expect(getByText(appointment, "Error").toBeInTheDocument());

  };

  
});