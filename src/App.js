import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import HomePage from './Pages/Home/';
import './App.css';

class App extends React.Component {
    state = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    onResize = e => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    render() {
        const { width, height } = this.state;
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/start" element={<HomePage width={width} height={height} isStart={true}/>} />
                    <Route path="" element={<HomePage width={width} height={height} isStart={false}/>} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;