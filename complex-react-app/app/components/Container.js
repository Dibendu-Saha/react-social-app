import React from "react";

function Container(prop) {
  return (
    <div
      className={"container py-md-5" + (prop.wide ? "" : " container--narrow")}
    >
      {prop.children}
    </div>
  );
}

export default Container;
