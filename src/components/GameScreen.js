import React  from "react";
import {Button} from "@mui/material";
import car_center from "../assets/cars/car_center.png"
import car_left from "../assets/cars/car_right.png"
import car_right from "../assets/cars/car_left.png"
import enemy_car_left from "../assets/cars/enemy_left.png"
import enemy_car_center from "../assets/cars/enemy_center.png"
import enemy_car_right from "../assets/cars/enemy_right.png"
import sky from "../assets/sky.png"
import road from "../assets/road.png"
import mountain_fade from "../assets/mountain_fade.png"
import {Sprite, Stage} from "@inlet/react-pixi"


class GameScreen extends React.Component{
    constructor(props){
        super(props);

        this.car_positions = {
            left: -1,
            center: 0,
            right: 1,
        };

        this.car_position_x_offset = 140;
        this.car_position_y_offset = 20;

        this.car_texture_left_img = new Image();
        this.car_texture_center_img = new Image();
        this.car_texture_right_img = new Image();
        this.enemy_car_texture_left_img = new Image();
        this.enemy_car_texture_center_img = new Image();
        this.enemy_car_texture_right_img = new Image();

        this.state={
            stage_width: 600,
            stage_height: 400,

            enemy_cars: [],
            enemy_car_texture_left: new Image(),
            enemy_car_texture_center: new Image(),
            enemy_car_texture_right: new Image(),

            racer_car_texture: this.car_texture_center_img,
            racer_car_position: this.car_positions.center,
            racer_car_position_x: 0,
            racer_car_position_y: 0,
            car_scale: 0.3,
            road_texture: new Image(),
            road_texture_pos_y: 0,
            sky_texture: new Image(),
            mountain_fade_texture: new Image(),
            mountain_fade_texture_pos_y: 0,
        };

        this.road_texture_img = new Image(this.state.stage_width, this.state.stage_height / 2);
        this.sky_texture_img = new Image(this.state.stage_width, this.state.stage_height / 2 + 5);
        this.mountain_fade_texture_img = new Image(this.state.stage_width, this.state.stage_height / 4);
    }

    render(){
        return (
            <div style={{margin:'50px'}}>
                <Stage width={this.state.stage_width} height={this.state.stage_height}>
                    <Sprite image={this.state.sky_texture}/>
                    <Sprite image={this.state.mountain_fade_texture}
                            y={this.state.mountain_fade_texture_pos_y}/>
                    <Sprite image={this.state.road_texture}
                            y={this.state.road_texture_pos_y}/>

                    {this.state.enemy_cars.map((enemy_car, index) => (
                        <Sprite image={this.state.enemy_car_texture_center}
                                key={index}
                                scale={enemy_car.scale}
                                x={(this.state.stage_width - this.state.enemy_car_texture_center.width * enemy_car.scale) / 2 }
                                y={enemy_car.enemy_car_position_texture_y}
                        />
                    ))}

                    <Sprite image={this.state.racer_car_texture}
                            x={this.state.racer_car_position_x}
                            y={this.state.racer_car_position_y}
                            scale={this.state.car_scale}/>
                </Stage>
                <br/>
                <Button onClick={() => this.moveCarLeft()} style={{margin: 15}}>{'<'}</Button>
                <Button onClick={() => this.moveCarRight()} style={{margin: 15}}>{'>'}</Button>
            </div>
        )
    }

    componentDidMount() {
        document.addEventListener('keydown', (event) => {
            if (event.key === "ArrowLeft") {
                this.moveCarLeft();
            } else if (event.key === "ArrowRight") {
                this.moveCarRight();
            }
        });

        this.car_texture_center_img.onload = () => {
            this.setRacerCarPosition(this.car_positions.center)
        }
        this.car_texture_left_img.src = car_left;
        this.car_texture_center_img.src = car_center;
        this.car_texture_right_img.src = car_right;

        this.enemy_car_texture_left_img.onload = () => {
            this.setState({
                enemy_car_texture_left: this.enemy_car_texture_left_img,
            })
        }

        this.enemy_car_texture_center_img.onload = () => {
            this.setState({
                enemy_car_texture_center: this.enemy_car_texture_center_img,
            })
        }

        this.enemy_car_texture_right_img.onload = () => {
            this.setState({
                enemy_car_texture_right: this.enemy_car_texture_right_img,
            })
        }

        this.enemy_car_texture_left_img.src = enemy_car_left;
        this.enemy_car_texture_center_img.src = enemy_car_center;
        this.enemy_car_texture_right_img.src = enemy_car_right;

        this.road_texture_img.onload = () => {
            let pos_y = this.state.stage_height - this.road_texture_img.height
            this.setState({
                road_texture: this.road_texture_img,
                road_texture_pos_y: pos_y
            })

            this.setState({
                enemy_cars: [this.newCar()]
            })
        }
        this.road_texture_img.src = road;

        this.sky_texture_img.onload = () => {
            this.setState({
                sky_texture: this.sky_texture_img,
            })
        }
        this.sky_texture_img.src = sky;

        this.mountain_fade_texture_img.onload = () => {
            let pos_y = this.state.sky_texture.height - this.mountain_fade_texture_img.height + 20
            this.setState({
                mountain_fade_texture: this.mountain_fade_texture_img,
                mountain_fade_texture_pos_y: pos_y
            })
        }
        this.mountain_fade_texture_img.src = mountain_fade;

        setInterval(() => {
            this.moveEnemyCars();
        }, 10)
    }

    getCarPositionX(carPosition) {
        switch (carPosition) {
            case this.car_positions.left:
                return this.car_position_x_offset;
            case this.car_positions.center:
                return (this.state.stage_width - (this.car_texture_center_img.naturalWidth * this.state.car_scale)) / 2;
            case this.car_positions.right:
                return (this.state.stage_width - (this.car_texture_right_img.naturalWidth * this.state.car_scale)) - this.car_position_x_offset;
            default:
                throw Error("Invalid position")
        }
    }

    getCarPositionY(carPosition) {
        switch (carPosition) {
            case this.car_positions.left:
                return this.state.stage_height - (this.car_texture_left_img.height * this.state.car_scale) - this.car_position_y_offset;
            case this.car_positions.center:
                return this.state.stage_height - (this.car_texture_center_img.height * this.state.car_scale) - this.car_position_y_offset;
            case this.car_positions.right:
                return this.state.stage_height - (this.car_texture_right_img.height * this.state.car_scale) - this.car_position_y_offset;
            default:
                throw Error("Invalid position")
        }
    }

    newCar() {
        return {
            scale: 0.05,
            position: this.car_positions.center,
            enemy_car_position_texture_y: this.state.road_texture_pos_y - this.state.enemy_car_texture_center.height * 0.1 / 2,
            distance_to_racer: 30,
            speed: 160,
        }
    }

    moveEnemyCars() {
        let updated_cars = []
        this.state.enemy_cars.forEach(car => {
            let old_distance = car.distance_to_racer
            car.distance_to_racer = car.distance_to_racer - (car.speed / 1000);
            let distance_diff = old_distance - car.distance_to_racer;
            car.enemy_car_position_texture_y = car.enemy_car_position_texture_y + distance_diff;
            car.scale += 0.001;
            if (car.distance_to_racer > 0) {
                updated_cars.push(car)
            } else {
                setTimeout(()=>{
                    this.setState({
                        enemy_cars: [this.newCar()]
                    })
                }, 500)
            }
        })

        this.setState({
            enemy_cars: updated_cars
        })
    }

    setEnemyCarPosition() {
        let new_car = this.state.enemy_cars[0]
        this.setState({
            enemy_cars: [new_car]
        })

    }

    setRacerCarPosition(new_position) {
        let new_car_texture = undefined
        switch (new_position) {
            case this.car_positions.left:
                new_car_texture = car_left;
                break;
            case this.car_positions.center:
                new_car_texture = car_center;
                break;
            case this.car_positions.right:
                new_car_texture = car_right;
                break;
            default:
                throw Error("Invalid position")
        }

        this.setState({
            racer_car_texture: new_car_texture,
            racer_car_position: new_position,
            racer_car_position_x: this.getCarPositionX(new_position),
            racer_car_position_y: this.getCarPositionY(new_position)
        });
    }

    moveCarRight() {
        if (this.state.racer_car_position !== this.car_positions.right)
            this.setRacerCarPosition(this.state.racer_car_position + 1)
    }

    moveCarLeft() {
        if (this.state.racer_car_position !== this.car_positions.left)
            this.setRacerCarPosition(this.state.racer_car_position - 1)
    }
}

export default GameScreen;