import React from "react";
import { io } from "socket.io-client";
import "./style.css";

const INIT = 0;
const RUNNING = 1;
const STOPPED = 2;

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.isControl = window.location.pathname === "/control";
        this.dates = [];
        this.state = {
            id: 'Connecting...',
            state: INIT,
            min: '00',
            sec: '00',
        };
    }

    tick = () => {
        if(this.dates.length === 0) {
            this.setState({
                ...this.state,
                state: INIT,
                min: '00',
                sec: '00',
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
        let min = Math.floor(ms / 60000).toString().padStart(2, '0');
        let sec = (Math.floor(ms / 1000) % 60).toString().padStart(2, '0');

        this.setState({
            ...this.state,
            state,
            min,
            sec,
        });
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('init', data => {
            this.setState({
                ...this.state,
                id: data.id,
            });
            this.dates = data.dates;
        });
        this.socket.on('update', data => {
            this.dates = data.dates;
        });
        
        this.interval = setInterval(() => this.tick(), 200);

        if(this.isControl) {
            document.addEventListener("keypress", (e) => {
                const { id, state } = this.state;
                console.log(e.code);
                if(e.code === 'Space') {
                    this.socket.emit(state === INIT ? "start" : state === RUNNING ? "stop" : "start", id);
                }
            });
        }
    }

    render() {
        const { width, height } = this.props;
        const { id, state, min, sec } = this.state;

        return (
            <div
                style={{
                    width, 
                    height,
                    display: "flex",
                    background: "#000",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        color: "#666",
                        fontSize: height * 0.02,
                    }}
                >
                    {id}
                </div>
                {
                    this.isControl && 
                    <div
                    style={{
                        position: "absolute",
                        left: width * 0.1,
                        top: height * 0.05,
                        width: width * 0.8,
                        height: height * 0.1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: height * 0.05,
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
                                background: "#3f3",
                                borderTopLeftRadius: height * 0.05,
                                borderBottomLeftRadius: height * 0.05,
                                userSelect: "none",
                            }}
                            onClick={e => {
                                this.socket.emit(state === INIT ? "start" : state === RUNNING ? "stop" : "start", id);
                            }}
                        >
                            {
                                state === INIT ? "시작" :
                                state === RUNNING ? "중지" : "계속"
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
                                background: "#aaa",
                                borderTopRightRadius: height * 0.05,
                                borderBottomRightRadius: height * 0.05,
                                userSelect: "none",
                            }}
                            onClick={e => {
                                this.socket.emit('initialize', id);
                            }}
                        >
                            초기화
                        </div>
                    </div>
                }
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: height * 0.25,
                        width: width, 
                        height: height * 0.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: width > height ? height * 0.3 : width * 0.3,
                        color: "#fc7",
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
                        {min}
                    </div>
                    <div
                        style={{
                            width: width * 0.1, 
                            height: '100%',
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
                        {sec}
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;