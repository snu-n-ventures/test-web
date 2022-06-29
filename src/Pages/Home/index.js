import React from "react";
import { io } from "socket.io-client";
import "./style.css";

class HomePage extends React.Component {
    state = {
        id: 'Connecting...',
        min: '00',
        sec: '00',
    }

    tick() {
        let sec = Math.floor((new Date() - new Date(this.start)) / 1000);
        this.setState({
            ...this.state,
            min: Math.floor(sec / 60).toString().padStart(2, '0'),
            sec: (sec % 60).toString().padStart(2, '0'),
        });
    }

    startTick(start) {
        console.log(start);
        if(!!this.interval) clearInterval(this.interval);
        this.start = start;
        this.interval = setInterval(() => this.tick(), 200);
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('init', data => {
            console.log(data);
            this.setState({
                ...this.state,
                id: data.id,
            });
            this.startTick(data.start);
        });
        this.socket.on('start', data => {
            this.startTick(data.start);
        });
    }

    render() {
        const { width, height, isStart } = this.props;
        const { id, min, sec } = this.state;

        return (
            <>
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
                    isStart && 
                    <div
                        className="start"
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
                            borderRadius: height * 0.05,
                        }}
                        onClick={e => {
                            console.log("Start!!!");
                            this.socket.emit('start', id);
                        }}
                    >
                        시작
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
            </>
        );
    }
}

export default HomePage;