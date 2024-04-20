import React from "react";
import "./sideNavItem.scss";

interface ISideNavProps {
  title: string;
  isActive: boolean;
  isDisabled: boolean;
}

export const SideNavItem = (props: ISideNavProps) => {
  const getClass = () => {
    if (props.isActive) {
      return "sidenav-item sidenav-active";
    }
    if (props.isDisabled) {
      return "sidenav-item sidenav-disabled";
    }
    return "sidenav-item";
  };
  return (
    <div className={getClass()}>
      <p>{props.title}</p>
    </div>
  );
};
