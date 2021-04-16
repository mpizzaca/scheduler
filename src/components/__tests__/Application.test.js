import React from "react";

import { render, cleanup } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

process.env.REACT_APP_WEBSOCKET_URL = `ws://localhost:8001`

it("renders without crashing", () => {
  render(<Application />);
});
