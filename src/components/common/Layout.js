import Appbar from "./Appbar";
import React from "react";

export default function Layout(props) {
  return (
    <>
      <Appbar />
      {props.children}
    </>
  );
}
