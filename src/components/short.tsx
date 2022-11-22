import {Component} from "react";

interface Props {
    shortName: string
}

function formatName(filename: string) {
    let name = filename.replaceAll("_", " ").replaceAll(/\.mp4$/g, "");
    let charnames = name.split(" vs ");
    for(let i = 0; i < charnames.length; i++){
        const charname = charnames[i][0].toUpperCase() + charnames[i].substring(1);
        if(i == 0) name = charname;
        else name += " vs "+charname;
    }
    return name;
}

class Short extends Component<Props> {

    state = {
        video: {
            src: "/shorts/"+this.props.shortName,
            poster: "/naruto.png"
        },
        shortName: formatName(this.props.shortName)
    }

    constructor(props: Props) {
        super(props);
    }

    onLoadStart(evt: any){
        evt.target.volume = 0.25;
    }

    render() {
        return (<div className={"short"}>
            <h2 className={"shortName"}>{this.state.shortName}</h2>
            <video controls
                src={this.state.video.src}
                poster={this.state.video.poster}
                width={500}
                height={500}
                onLoadStart={this.onLoadStart.bind(this)}

            />
        </div>)
    }
}

export default Short