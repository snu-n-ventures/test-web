import React from "react";
import { io } from "socket.io-client";
import "./style.css";

const INIT = 0;
const RUNNING = 1;
const STOPPED = 2;
const SETTING = 3;

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.dates = [];
        this.tms = 0;
        this.state = {
            id: '',
            starter: '',
            state: INIT,
            ms: 0,
            isSettingMin: false,
            isSettingSec: false,
            min: null,
            sec: null,
        };
    }

    tick = () => {
        if(this.state.state === SETTING) {
            return;
        }
        if(this.dates.length === 0) {
            if(this.state.state === INIT) return;
            this.setState({
                ...this.state,
                starter: this.starter,
                state: INIT,
                ms: 0,
            });
            return;
        }

        let ms = 0;
        for(let i=1; i<this.dates.length; i+=2) {
            let start = this.dates[i-1];
            let stop = this.dates[i];
            ms += new Date(stop) - new Date(start);
        }

        let state = (this.dates.length % 2 === 1) ? RUNNING : STOPPED;
        if(state === RUNNING) {
            let start = this.dates[this.dates.length - 1];
            ms += new Date() - new Date(start);
        }

        const time = this.tms === 0 ? ms : this.tms - ms;

        this.setState({
            ...this.state,
            starter: this.starter,
            state,
            ms: time,
        });
    }

    componentDidMount() {
        this.socket = io();
        this.socket.emit('init', window.location.pathname);

        this.socket.on('init', data => {
            this.setState({
                ...this.state,
                id: data.id,
            });
            this.dates = data.dates;
            this.starter = data.starter;
            this.tms = data.tms;
        });
        this.socket.on('update', data => {
            this.dates = data.dates;
            this.starter = data.starter;
            this.tms = data.tms;
        });
        
        this.interval = setInterval(() => this.tick(), 20);
    }

    render() {
        const { width, height } = this.props;
        const { id, starter, state, ms, isSettingMin, isSettingSec, min, sec } = this.state;

        const minNum = state === SETTING ? (min || 0) : Math.floor(Math.max(ms, 0) / 60000);
        const secNum = state === SETTING ? (sec || 0) : Math.floor(Math.max(ms, 0) / 1000) % 60;
        const fontSize = width > height ? height * 0.45 : width * 0.45;
        const borderWidth = 2;
        
        return (
            <div
                style={{
                    width, 
                    height,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: '#fff',
                    transition: "background 0.5s",
                }}
            >
                {
                    !!id && 
                    <>
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            color: "#999",
                            fontSize: height * 0.02,
                        }}
                    >
                        {`ID: ${id} | Started By: ${starter}`}
                    </div>
                    <div
                        className="buttons"
                        style={{
                            position: "absolute",
                            left: width * 0.1,
                            bottom: height * 0.05,
                            width: width * 0.8,
                            height: height * 0.1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: width * 2 > height ? height * 0.04 : width * 0.08,
                            borderRadius: height * 0.05,
                        }}
                    >
                        <div
                            className="button"
                            style={{
                                width: width * 0.4,
                                height: height * 0.1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: state === INIT ? "#3f3" : state === RUNNING ? "#f33" : "#3f3",
                                borderTopLeftRadius: height * 0.05,
                                borderBottomLeftRadius: height * 0.05,
                            }}
                            onClick={e => {
                                this.socket.emit((state === SETTING || state === INIT) ? "start" : state === RUNNING ? "stop" : "continue", {
                                    min: min,
                                    sec: sec,
                                    path: window.location.pathname
                                });
                                this.setState({
                                    ...this.state,
                                    state: RUNNING,
                                    isSettingMin: false,
                                    isSettingSec: false,
                                    min: null,
                                    sec: null,
                                });
                            }}
                        >
                            {
                                (state === SETTING || state === INIT) ? "시작" : state === RUNNING ? "중지" : "계속"
                            }
                        </div>
                        <div
                            className="button"
                            style={{
                                width: width * 0.4,
                                height: height * 0.1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#ccc",
                                borderTopRightRadius: height * 0.05,
                                borderBottomRightRadius: height * 0.05,
                            }}
                            onClick={e => {
                                if(this.state.state === SETTING) {
                                    this.setState({
                                        ...this.state,
                                        state: INIT,
                                        isSettingMin: false,
                                        isSettingSec: false,
                                        min: null,
                                        sec: null,
                                    });
                                }
                                else {
                                    this.socket.emit('initialize', window.location.pathname);
                                }
                            }}
                        >
                            {
                                (state === SETTING) ? "취소" : "초기화"
                            }
                        </div>
                    </div>
                    </>
                }
                <div
                    className="clock"
                    style={{
                        width: width, 
                        height: fontSize,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: fontSize,
                        color: "#222",
                        textShadow: "5px 15px 20px #333",
                        transition: "color 3s, text-shadow 3s",
                    }}
                >
                    {
                        isSettingMin ? 
                        <input
                            type="number"
                            style={{
                                width: fontSize - borderWidth, 
                                height: fontSize - borderWidth, 
                                display: "flex",
                                alignItems: "center",
                                borderRadius: width * 0.01,
                                justifyContent: "flex-end",
                                borderWidth: borderWidth,
                            }}
                            onChange={(e) => {
                                if(e.target.value === "") {
                                    this.setState({
                                        ...this.state,
                                        min: null,
                                    });
                                    return;
                                }
                                this.setState({
                                    ...this.state,
                                    min: Math.min(Math.max(e.target.value, 0), 99),
                                });
                            }}
                            value={min}
                        /> :
                        <div
                            style={{
                                width: fontSize, 
                                height: fontSize, 
                                display: "flex",
                                alignItems: "center",
                                borderRadius: width * 0.01,
                                justifyContent: "flex-end",
                            }}
                            onClick={e => {
                                e.preventDefault();
                                this.setState({
                                    ...this.state,
                                    isSettingMin: true,
                                    isSettingSec: false,
                                    state: SETTING,
                                });
                            }}
                        >
                            {minNum.toString().padStart(2, '0')}
                        </div>
                    }
                    <div
                        style={{
                            width: width * 0.1,
                            height: width * 0.3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 1 - 0.7 * (ms % 1000) / 1000,
                        }}
                        onClick={e => {
                            this.setState({
                                ...this.state,
                                isSettingMin: false,
                                isSettingSec: false,
                            });
                        }}
                    >
                        :
                    </div>
                    {
                        isSettingSec?
                        <input
                            type="number"
                            style={{
                                width: fontSize - borderWidth, 
                                height: fontSize - borderWidth, 
                                display: "flex",
                                alignItems: "center",
                                borderRadius: width * 0.01,
                                justifyContent: "flex-start",
                                borderWidth: borderWidth,
                            }}
                            onChange={(e) => {
                                if(e.target.value === "") {
                                    this.setState({
                                        ...this.state,
                                        sec: null,
                                    });
                                    return;
                                }
                                this.setState({
                                    ...this.state,
                                    sec: Math.min(Math.max(e.target.value, 0), 59),
                                });
                            }}
                            value={sec}
                        /> :
                        <div
                            style={{
                                width: fontSize, 
                                height: fontSize, 
                                display: "flex",
                                alignItems: "center",
                                borderRadius: width * 0.01,
                                justifyContent: "flex-start",
                            }}
                            onClick={e => {
                                this.setState({
                                    ...this.state,
                                    isSettingSec: true,
                                    isSettingMin: false,
                                    state: SETTING,
                                });
                            }}
                        >
                            {secNum.toString().padStart(2, '0')}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default HomePage;