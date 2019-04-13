import React, { Component } from "react";
import "../styles/Instructions.scss";

class Instructions extends Component {
  render() {
    return (
      <div>
        <h2 className="main-title">Beginner tutorial</h2>
        <div className="instructions">
          <div className="card">
            <h3 className="card-title">Creating and connecting States</h3>
            <div className="card-content">
              <p>
                Let's start with creating our first <strong>State</strong>
                !<br />
                <span className="key-indicator">dblClick</span> anywhere on the
                canvas to create a State.
              </p>
              <p>Three things happened:</p>
              <ol>
                <li>A state has been created.</li>
                <li>
                  Since it is the first in the graph, it is marked as{" "}
                  <strong>initial</strong>, that is its color is red.
                </li>
                <li>
                  A textbox appeared in order to let you type the name of the
                  state.
                </li>
              </ol>
              <p>
                Now, let's create another state by{" "}
                <span className="key-indicator">dblClick</span> in another
                position.
                <br /> Mark it as an acceptance state by{" "}
                <span className="key-indicator">Alt+click</span>.
              </p>
              <p>
                You surely have noted that when you{" "}
                <span className="key-indicator">hover</span> on a state, 4
                smaller circles appear on the cardinal points.
                <br />
                These circles are the <strong>Anchor points</strong> and they
                let you <em>connect</em> 2 states through a transition.
              </p>
              <p>
                Try to <span className="key-indicator">drag</span> one of these
                anchor points. An arrow appears!
                <br />
                Then release the mouse when above the other state: you have
                succesfuly connected 2 states. In addition, a textbox appeared
                here too.
              </p>
              <p>
                Last but not least, to create reentrant transition - that is an
                edge starting and ending to the same state - just{" "}
                <span className="key-indicator">Alt+click</span> on an Anchor
                point.
              </p>
            </div>
          </div>
          <div className="card">
            <h3 className="card-title">Mooving & Zooming</h3>
            <div className="card-content">
              <p>
                The editor lets you perform the usual interactions everyone
                expects from a graphical editor.
              </p>
              <ul>
                <li>Dragging the canvas allows you to move freely around.</li>
                <li>Every state can be moved through dragging too.</li>
              </ul>
              <p>
                In addition, holding the{" "}
                <span className="key-indicator">Alt</span> key and dragging the
                canvas will create a multi-selection box. States selected
                together are grouped; this means that moving one state will move
                the others accordingly.
              </p>
              <p>
                Zoom is present too, and it is enabled through the mouse{" "}
                <span className="key-indicator">scroll</span>
              </p>
              <p>
                If playing with translations and zooming took you too far from
                your work, you can simply refocus to the graph using the{" "}
                <strong>fit button</strong> placed here on the right.
              </p>
            </div>
          </div>
          <div className="card">
            <h3 className="card-title">Deleting & Editing</h3>
            <div className="card-content">
              <p>
                Selecting single objects is just a{" "}
                <span className="key-indicator">click</span> away! Or take
                advantage of the multi-selection box aforementioned.
                <br />
                Once selected, any objects can be removed from graph by pressing
                the <span className="key-indicator">Del</span> key.
              </p>
              <p>
                Every label can be edited through{" "}
                <span className="key-indicator">dblClick</span> on the
                corresponding object.
              </p>
              <p>
                If you ever need to specify a different initial state, just{" "}
                <span className="key-indicator">Shift+click</span> on it!
                <br />
                If, instead, you want to mark or unmark a state as final you can{" "}
                <span className="key-indicator">Alt+click</span> on it.
              </p>
            </div>
          </div>
          <div className="card">
            <h3 className="card-title">Analyze Paths</h3>
            <div className="card-content">
              <p>
                When you are done with designing your graph, you might want to
                answer a specific question:
              </p>
              <blockquote>
                "Given a graph, let me see all the paths leading to any choseen
                node from the initial one."
              </blockquote>
              <p>
                In order to answer this question you can enter{" "}
                <strong>Analysis Mode</strong> clicking on the corresponding
                button in the action bar.
              </p>
              <p>
                Upon activating this mode, the graph becames uneditable and you
                are presented with dropdown list used to select the target state
                in order to calculate all the paths leading to it.
              </p>
              <p>
                Just select a state an click on the <strong>run</strong> button!
              </p>
              <p>
                A box slides in showing a list of all possible path leading to
                the chosen state.
                <br />
                Hovering on any of them will highlight the corresponding path on
                the graph! If you need to <em>lock</em> the highlight just click
                on it instead of hovering.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { Instructions };
