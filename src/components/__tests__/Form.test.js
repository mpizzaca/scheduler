import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Form from "../Appointment/Form";

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png",
    },
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name="Lydia Miller-Jones" />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("prevents default form submission on the name field", () => {
    // render the form
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );

    // enter a name
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });
    // press enter key
    fireEvent.submit(getByPlaceholderText("Enter Student Name"));

    // make sure form is still there and populated
    expect(getByPlaceholderText("Enter Student Name")).toBeInTheDocument();
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue(
      "Lydia Miller-Jones"
    );
  });

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );
    fireEvent.click(getByText("Save"));
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("validates that the interviewer is not blank", () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form
        interviewers={interviewers}
        name={"Lydia Miller-Jones"}
        onSave={onSave}
      />
    );
    fireEvent.click(getByText("Save"));
    expect(getByText(/interviewer cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("can successfully save after trying to submit an empty student name and empty interviewer", () => {
    const onSave = jest.fn();
    const {
      getByText,
      getByPlaceholderText,
      queryByText,
      getByTestId,
    } = render(<Form interviewers={interviewers} onSave={onSave} />);

    fireEvent.click(getByText("Save"));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(queryByText(/interviewer cannot be blank/i)).toBeNull();
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByText("Save"));

    expect(getByText(/interviewer cannot be blank/i)).toBeInTheDocument();
    expect(queryByText(/student name cannot be blank/i)).toBeNull();

    fireEvent.click(getByTestId("interviewer-list-item"));
    fireEvent.click(getByText("Save"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(queryByText(/interviewer cannot be blank/i)).toBeNull();

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it("calls onCancel and resets the input field", () => {
    const onCancel = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Mill-Jones"
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.click(getByText("Save"));

    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByText("Cancel"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();

    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
