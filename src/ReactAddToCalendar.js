import React, { Component } from "react";
import PropTypes from "prop-types";

import helpersClass from "./helpers";
const helpers = new helpersClass();

/* eslint-disable */
function listItemTemplate({
  listItem,
  event,
  itemClick,
  url,
  displayItemIcons
}) {
  let currentItem = Object.keys(listItem)[0];
  let currentLabel = listItem[currentItem];

  let icon = null;
  if (displayItemIcons) {
    let currentIcon =
      currentItem === "outlook" || currentItem === "outlookcom"
        ? "windows"
        : currentItem;
    icon = <i className={"fa fa-" + currentIcon} />;
  }

  return (
    <li key={helpers.getRandomKey()}>
      <a
        className={currentItem + "-link"}
        onClick={itemClick}
        href={url}
        target="_blank"
      >
        {icon}
        {currentLabel}
      </a>
    </li>
  );
}

listItemTemplate.propTypes = {
  displayItemIcons: PropTypes.bool,
  listItem: PropTypes.object,
  event: PropTypes.object,
  itemClick: PropTypes.func,
  url: PropTypes.string
};

function dropdownTemplate(items, className) {
  return (
    <div className={className}>
      <ul>{items}</ul>
    </div>
  );
}

export default class ReactAddToCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      optionsOpen: props.optionsOpen || false,
      isCrappyIE: this.checkIE()
    };

    this.toggleCalendarDropdown = this.toggleCalendarDropdown.bind(this);
    this.handleDropdownLinkClick = this.handleDropdownLinkClick.bind(this);
  }

  checkIE() {
    // polyfill for startsWith to fix IE bug
    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
      };
    }

    let isCrappyIE = false;
    if (
      typeof window !== "undefined" &&
      window.navigator.msSaveOrOpenBlob &&
      window.Blob
    ) {
      isCrappyIE = true;
    }
    return isCrappyIE;
  }

  toggleCalendarDropdown() {
    let showOptions = !this.state.optionsOpen;

    if (showOptions) {
      document.addEventListener("click", this.toggleCalendarDropdown, false);
    } else {
      document.removeEventListener("click", this.toggleCalendarDropdown);
    }

    this.setState({ optionsOpen: showOptions });
  }

  handleDropdownLinkClick(e) {
    e.preventDefault();
    let url = e.currentTarget.getAttribute("href");

    if (
      !helpers.isMobile() &&
      (url.startsWith("data") || url.startsWith("BEGIN"))
    ) {
      let filename = "download.ics";
      let blob = new Blob([url], { type: "text/calendar;charset=utf-8" });

      if (this.state.isCrappyIE) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        /****************************************************************
        // many browsers do not properly support downloading data URIs
        // (even with "download" attribute in use) so this solution
        // ensures the event will download cross-browser
        ****************************************************************/
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      window.open(url, "_blank");
    }

    this.toggleCalendarDropdown();
  }

  renderDropdown() {
    let self = this;

    let items = this.props.listItems.map(listItem => {
      return this.props.listItemTemplate({
        listItem,
        event: self.props.event,
        itemClick: self.handleDropdownLinkClick,
        url: helpers.buildUrl(
          self.props.event,
          Object.keys(listItem)[0], //label of listItem[label]
          self.state.isCrappyIE
        )
      });
    });

    return this.props.dropdownTemplate(items, this.props.dropdownClass);
  }

  renderButton() {
    let buttonLabel = this.props.buttonLabel;
    let buttonIcon = null;

    // allow buttonTemplate to be render prop
    let btnTemplateIsFunction = typeof this.props.buttonTemplate === "function";
    let template = btnTemplateIsFunction
      ? this.props.buttonTemplate
      : Object.keys(this.props.buttonTemplate);
    if (template[0] !== "textOnly") {
      const iconPlacement = this.props.buttonTemplate[template];
      const buttonClassPrefix =
        this.props.buttonIconClass === "react-add-to-calendar__icon--"
          ? `${this.props.buttonIconClass}${iconPlacement}`
          : this.props.buttonIconClass;
      const iconPrefix = this.props.useFontAwesomeIcons ? "fa fa-" : "";

      const mainButtonIconClass =
        template[0] === "caret"
          ? this.state.optionsOpen
            ? "caret-up"
            : "caret-down"
          : template[0];

      let buttonIconClass = `${buttonClassPrefix} ${iconPrefix}${mainButtonIconClass}`;

      buttonIcon = <i className={buttonIconClass} />;
      buttonLabel =
        iconPlacement === "right" ? (
          <span>
            {buttonLabel + " "}
            {buttonIcon}
          </span>
        ) : (
          <span>
            {buttonIcon}
            {" " + buttonLabel}
          </span>
        );
    }

    let buttonClass = this.state.optionsOpen
      ? this.props.buttonClassClosed + " " + this.props.buttonClassOpen
      : this.props.buttonClassClosed;

    return btnTemplateIsFunction ? (
      template(
        { ...this.props, buttonClass, buttonLabel },
        this.toggleCalendarDropdown
      )
    ) : (
      <div className={this.props.buttonWrapperClass}>
        <a className={buttonClass} onClick={this.toggleCalendarDropdown}>
          {buttonLabel}
        </a>
      </div>
    );
  }

  render() {
    let options = null;
    if (this.state.optionsOpen) {
      options = this.renderDropdown();
    }

    let addToCalendarBtn = null;
    if (this.props.event) {
      addToCalendarBtn = this.renderButton();
    }

    return (
      <div
        className={
          !!this.props.className
            ? this.props.className + " " + this.props.rootClass
            : this.props.rootClass
        }
      >
        {addToCalendarBtn}
        {options}
      </div>
    );
  }
}

ReactAddToCalendar.displayName = "Add To Calendar";

ReactAddToCalendar.propTypes = {
  buttonClassClosed: PropTypes.string,
  buttonClassOpen: PropTypes.string,
  buttonLabel: PropTypes.string,
  buttonTemplate: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  buttonIconClass: PropTypes.string,
  className: PropTypes.string,
  useFontAwesomeIcons: PropTypes.bool,
  buttonWrapperClass: PropTypes.string,
  displayItemIcons: PropTypes.bool,
  optionsOpen: PropTypes.bool,
  dropdownClass: PropTypes.string,
  dropdownTemplate: PropTypes.func,
  event: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string
  }).isRequired,
  listItems: PropTypes.arrayOf(PropTypes.object),
  listItemTemplate: PropTypes.func,
  rootClass: PropTypes.string
};

ReactAddToCalendar.defaultProps = {
  buttonClassClosed: "react-add-to-calendar__button",
  buttonClassOpen: "react-add-to-calendar__button--light",
  buttonLabel: "Add to My Calendar",
  buttonTemplate: { caret: "right" },
  buttonIconClass: "react-add-to-calendar__icon--",
  className: null,
  useFontAwesomeIcons: true,
  buttonWrapperClass: "react-add-to-calendar__wrapper",
  displayItemIcons: true,
  optionsOpen: false,
  dropdownClass: "react-add-to-calendar__dropdown",
  dropdownTemplate: dropdownTemplate,
  event: {
    title: "Sample Event",
    description: "This is the sample event provided as an example only",
    location: "Portland, OR",
    startTime: "2016-09-16T20:15:00-04:00",
    endTime: "2016-09-16T21:45:00-04:00"
  },
  listItems: [
    { apple: "Apple Calendar" },
    { google: "Google" },
    { outlook: "Outlook" },
    { outlookcom: "Outlook.com" },
    { yahoo: "Yahoo" }
  ],
  listItemTemplate: listItemTemplate,
  rootClass: "react-add-to-calendar"
};
