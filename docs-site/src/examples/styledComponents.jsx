import React, { Component } from "react";
import AddToCalendar from "react-add-to-calendar";
import styled from "styled-components";

const AddToCalendarStyled = styled(AddToCalendar)`
  & .react-add-to-calendar__dropdown {
    min-width: 200px;
  }
`;

export default class StyledComponentExample extends React.Component {
  render() {
    let event = {
      title: "Sample Event",
      description: "This is the sample event provided as an example only",
      location: "Portland, OR",
      startTime: "2016-09-16T20:15:00-04:00",
      endTime: "2016-09-16T21:45:00-04:00"
    };

    return (
      <div className="row">
        <pre className="column example__code">
          <code className="js">
            {"const AddToCalendarStyled = styled(AddToCalendar)`"}
            <br />
            {"    & .react-add-to-calendar__dropdown {"}
            <br />
            {"        min-width: 200px;"}
            <br />
            {"    }"}
            <br />
            {" `};"}
            <br />
            {"let event = {"}
            <br />
            &nbsp;&nbsp;&nbsp;
            {"  title: 'Sample Event',"}
            <br />
            &nbsp;&nbsp;&nbsp;
            {
              "  description: 'This is the sample event provided as an example only',"
            }
            <br />
            &nbsp;&nbsp;&nbsp;
            {"  location: 'Portland, OR',"}
            <br />
            &nbsp;&nbsp;&nbsp;
            {"  startTime: '2016-09-16T20:15:00-04:00',"}
            <br />
            &nbsp;&nbsp;&nbsp;
            {"  endTime: '2016-09-16T21:45:00-04:00'"}
            <br />
            {"};"}
            <br />
            <br />
            {"/*"}
            <br />
            &nbsp;&nbsp;&nbsp;
            {"startTime and endTime can use any datetime"}
            <br />
            &nbsp;&nbsp;&nbsp;
            {"string that is acceptable by MomentJS"}
            <br />
            {"*/"}
          </code>
          <code className="jsx">
            {"<AddToCalendarStyled buttonLabel='Add' event={event} />"}
            {
              "<AddToCalendarStyled buttonTemplate= buttonLabel='Add' event={event} />"
            }
          </code>
        </pre>
        <div className="column">
          <AddToCalendarStyled buttonLabel="Add" event={event} />
          <AddToCalendarStyled
            buttonLabel="Add"
            listItemTemplate={({ listItem, event, itemClick, url }) => {
              let currentItem = Object.keys(listItem)[0];
              let currentLabel = listItem[currentItem];

              return (
                <li key={currentLabel}>
                  <a href={url} target="_blank">
                    {currentLabel}
                  </a>
                </li>
              );
            }}
            buttonTemplate={(props, toggleCallback) => {
              return (
                <div className={props.buttonWrapperClass}>
                  <button
                    type="button"
                    className={props.buttonClass}
                    onClick={toggleCallback}
                  >
                    {props.buttonLabel}
                  </button>
                </div>
              );
            }}
            event={event}
          />
        </div>
      </div>
    );
  }
}

StyledComponentExample.displayName = "StyledComponentExample";
