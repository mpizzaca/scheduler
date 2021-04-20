import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  fireEvent,
  getByText,
  queryByText,
  getByAltText,
  waitForElement,
  getAllByTestId,
  getByPlaceholderText,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((dayListItem) =>
      queryByText(dayListItem, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // render the application
    const { container } = render(<Application />);

    // wait until 'Archie Cohen' is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // click the 'cancel' button on Archie Cohen's interview
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    // check that the text 'Are you sure you want to cancel the interview?' is displayed
    expect(
      getByText(appointment, "Are you sure you want to cancel the interview?")
    ).toBeInTheDocument();

    // click the confirm button
    fireEvent.click(getByText(appointment, "Confirm"));

    // check that the text 'Deleting...' is displayed
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // wait until the 'new appointment' button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));

    // check spots remaining = 2
    const day = getAllByTestId(container, "day").find((dayListItem) =>
      queryByText(dayListItem, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // render the application
    const { container } = render(<Application />);

    // wait until 'Archie Cohen' is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // click the 'edit' button on Archie Cohen's interview
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));

    // update the student name to 'Tom Smith'
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Tom Smith" },
    });

    // update the interviewer to Sylvia Palmer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // click 'Save' button
    fireEvent.click(getByText(appointment, "Save"));

    // check 'Saving...' is displayed
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // wait until the interview is shown with 'Tom Smith'
    await waitForElement(() => getByText(appointment, "Tom Smith"));

    // wait until the interview is shown with interviewer 'Sylvia Palmer'
    await waitForElement(() => getByText(appointment, "Sylvia Palmer"));

    // check spots remaining = 1
    const day = getAllByTestId(container, "day").find((dayListItem) =>
      queryByText(dayListItem, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    // prepare the mock rejection
    axios.put.mockRejectedValueOnce();

    // render the application
    const { container } = render(<Application />);

    // wait until 'Archie Cohen' is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // store our empty appointment
    const appointment = getAllByTestId(container, "appointment")[0];

    // click 'add' button to create new appointment
    fireEvent.click(getByAltText(appointment, "Add"));

    // enter name
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });
    // select interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // click 'save' button
    fireEvent.click(getByText(appointment, "Save"));

    // check 'Saving...' text is displayed
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // wait until "Whoops! There was an error when saving the interview. Please try again." is shown
    await waitForElement(() =>
      getByText(
        appointment,
        "Whoops! There was an error when saving the interview. Please try again."
      )
    );

    // click 'x'
    fireEvent.click(getByAltText(appointment, "Close"));

    // check we're back in 'create appointment' mode
    expect(getByPlaceholderText(appointment, "Enter Student Name"));
  });

  it("shows the delete error when failing to delete and existing appointment", async () => {
    // prepare the mock rejection
    axios.delete.mockRejectedValueOnce();

    // render the application
    const { container } = render(<Application />);

    // wait until 'Archie Cohen' is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // store Archie's appointment
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));

    // cancel the interview
    fireEvent.click(getByAltText(appointment, "Delete"));

    // check that the text 'Are you sure you want to cancel the interview?' is displayed
    expect(
      getByText(appointment, "Are you sure you want to cancel the interview?")
    ).toBeInTheDocument();

    // click the confirm button
    fireEvent.click(getByText(appointment, "Confirm"));

    // check that the text 'Deleting...' is displayed
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // wait until "Whoops! There was an error deleting the interview. Please try again." is displayed
    await waitForElement(() =>
      getByText(
        appointment,
        "Whoops! There was an error deleting the interview. Please try again."
      )
    );

    // click 'x'
    fireEvent.click(getByAltText(appointment, "Close"));

    // check we're back in 'show appointment' mode
    expect(getByText(appointment, "Archie Cohen"));
  });
});
