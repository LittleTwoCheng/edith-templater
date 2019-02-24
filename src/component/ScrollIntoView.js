//Component
import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

//libraries
import scrollIntoView from "scroll-into-view-if-needed";
import throttle from "../core/throttle";

const POSITIONS = {
    START: "start",
    CENTER: "center",
    END: "end",
    NEAREST: "nearest"
};

const scrollIntoViewWithThrottle = throttle(scrollIntoView, 500);

class ScrollIntoView extends Component {
    constructor(props) {
        super(props);
        this.ele = createRef();
    }
    componentDidMount() {
        if (this.props.willScroll) {
            this.scroll();
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.props.willScroll &&
            this.props.check !== null &&
            prevProps.check !== this.props.check
        ) {
            this.scroll();
        }
    }
    scroll() {
        scrollIntoViewWithThrottle(this.ele.current, {
            block: this.props.position,
            inline: this.props.position,
            behavior: "smooth"
        });
    }

    render() {
        return <span ref={this.ele} />;
    }
}

ScrollIntoView.positions = POSITIONS;

ScrollIntoView.defaultProps = {
    position: POSITIONS.START,
    check: null
};

ScrollIntoView.propTypes = {
    position: PropTypes.oneOf(Object.values(POSITIONS)),
    willScroll: PropTypes.bool,
    check: PropTypes.any
};

export default ScrollIntoView;
