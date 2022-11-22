import React  from "react";
import GameScreen from "../components/GameScreen"

class Main extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div style={{margin:'50px'}}>
                <GameScreen></GameScreen>
            </div>
        )
    }
}

export default Main;