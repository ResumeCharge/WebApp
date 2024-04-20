import React from "react";
import "./sideNav.scss";
import { ISection } from "../../pages/createPortfolio/constants";
import { SideNavItem } from "./sideNavItem";

interface ISideNavProps {
  sectionsMap: Map<string, ISection>;
  handleMenuClick(sectionId: string): void;
  activeSection: string;
}

export const SideNav = (props: ISideNavProps) => {
  return (
    <div>
      {Array.from(props.sectionsMap, ([sectionId, section]) => ({
        sectionId,
        section,
      })).map(({ section, sectionId }) => {
        return (
          <div
            onClick={() => props.handleMenuClick(sectionId)}
            key={section.id}
          >
            <SideNavItem
              title={section.title}
              isActive={section.id === props.activeSection}
              isDisabled={section.isDisabled}
            />
          </div>
        );
      })}
    </div>
  );
};
