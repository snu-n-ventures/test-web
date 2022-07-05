import React from "react";
import { io } from "socket.io-client";
import "./style.css";

const INIT = 0;
const RUNNING = 1;
const STOPPED = 2;

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.dates = [];
        this.state = {
            id: '',
            starter: '',
            state: INIT,
            ms: 0,
            darkmode: true,
        };
    }

    tick = () => {
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

        this.setState({
            ...this.state,
            starter: this.starter,
            state,
            ms,
        });
    }

    componentDidMount() {
        this.socket = io();
        this.socket.emit('init', window.location.pathname);

        this.socket.on('init', data => {
            if(!!data.id) {
                document.addEventListener("keypress", (e) => {
                    const { state } = this.state;
                    if(e.code === 'Space') {
                        this.socket.emit(state === INIT ? "start" : state === RUNNING ? "stop" : "continue", window.location.pathname);
                    }
                });
            }
            this.setState({
                ...this.state,
                id: data.id,
            });
            this.dates = data.dates;
            this.starter = data.starter;
        });
        this.socket.on('update', data => {
            this.dates = data.dates;
            this.starter = data.starter;
        });
        
        this.interval = setInterval(() => this.tick(), 20);
    }

    render() {
        const { width, height } = this.props;
        const { id, starter, state, ms, darkmode } = this.state;

        return (
            <div
                style={{
                    width, 
                    height,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: darkmode ? "#000" : '#fff',
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
                                this.socket.emit(state === INIT ? "start" : state === RUNNING ? "stop" : "continue", window.location.pathname);
                            }}
                        >
                            {
                                state === INIT ? "시작" : state === RUNNING ? "중지" : "계속"
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
                                this.socket.emit('initialize', window.location.pathname);
                            }}
                        >
                            초기화
                        </div>
                    </div>
                    </>
                }
                <div
                    className="clock"
                    style={{
                        width: width, 
                        height: height,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: width > height ? height * 0.45 : width * 0.45,
                        color: darkmode ? "#fff" : "#222",
                        textShadow: darkmode ? 
                        "0 0 7px #ddd, 0 0 25px #fc3" : 
                        "5px 15px 20px #333",
                        transition: "color 3s, text-shadow 3s",
                    }}
                >
                    <div
                        style={{
                            width: width * 0.3, 
                            height: '100%',
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        {Math.floor(ms / 60000).toString().padStart(2, '0')}
                    </div>
                    <div
                        style={{
                            width: width * 0.1,
                            height: '100%',
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 1 - 0.7 * (ms % 1000) / 1000,
                        }}
                        onClick={e => {
                            this.setState({
                                darkmode: !darkmode,
                            });
                        }}
                    >
                        :
                    </div>
                    <div
                        style={{
                            width: width * 0.3, 
                            height: '100%',
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        {(Math.floor(ms / 1000) % 60).toString().padStart(2, '0')}
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;