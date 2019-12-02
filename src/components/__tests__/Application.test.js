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

    // const appointments = getAllByTestId(container, "appointment");

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
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // const appointments = getAllByTestId(container, "appointment");

    const appointment = getAllByTestId(container, "appointment")[1];

    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Press confirm to remove this interview")).toBeInTheDocument();

    
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));
    
    // 6. Check that the element with the text "Deleting" is displayed.
    await expect(getByText(appointment, "Cancelling interview")).toBeInTheDocument()

    // 7. Wait until the element with the "Add" button is displayed.
    expect(getByAltText(appointment, "Add")).toBeInTheDocument();
    
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

     const { container, debug } = render(<Application />);
  
     await waitForElement(() => getByText(container, "Archie Cohen"));
 
     const appointment = getAllByTestId(container, "appointment")[1];

    // 3. Click the "Edit" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Edit"));
    // 4. Check that the create appointment screen is shown with prefilled fields
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
    // 5. Click the "Save" button
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving interview")).toBeInTheDocument();
    // 7. Wait until the element with the the updated information is displayed.
    await expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
    // 8. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  })

});