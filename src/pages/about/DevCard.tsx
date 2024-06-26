import GithubIcon from './GithubIcon';

type DevCardProps = {
    imgURL: string;
    name: string;
    title: string;
    bio: string;
    contributions: string[];
    github: string;
};

export default function DevCard(dev: DevCardProps) {
    return (
        <div className="devs-card-info-wrapper">
            <div className="dev-avatar">
                <div className="round-avatar">
                    <img className="dev-photo" src={dev.imgURL} />
                </div>
            </div>
            <p className="dev-name">{dev.name}</p>
            <p className="dev-title">{dev.title}</p>
            <p className="dev-bio">{dev.bio}</p>
            <ul className="contributions">
                {dev.contributions.map((li, index: number) => {
                    return (
                        <li className="contributions-item" key={index}>
                            {li}
                        </li>
                    );
                })}
            </ul>
            <a href={'https://github.com/' + dev.github} target="_blank">
                <GithubIcon />
            </a>
        </div>
    );
}
