import React, {useMemo} from "react"
import {useAuth0} from "../../helpers/react-auth0-spa"
import "./Poem.css"
import Line from "./Line"
import {
    getActiveVotingFromPoem
} from "../../helpers/utils";
import canAddLineToPoem from "../../helpers/canAddLineToPoem";
import Skeleton from "react-loading-skeleton";
import {getRandomLineWidth, SKELETON_LINE_NUM} from "../../helpers/poem-skeleton-helpers";
import LineInput from "./LineInput";
import PoemVoting from "./PoemVoting";
import PoemFooter from "./PoemFooter";


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

let linesSkeletonArr = [];
for (let i = 0; i < SKELETON_LINE_NUM; i++) {
    linesSkeletonArr.push(<Skeleton className={"line"} key={'lines-pholder-' + i}
                                    width={getRandomLineWidth()}/>)
}

function Poem({poem, setPoem, showSkeleton}) {

    const {user} = useAuth0();
    const titleLineWidth = useMemo(getRandomLineWidth, [])
    if (!showSkeleton && !poem) {
        return null;

    }
    const activeVoting = getActiveVotingFromPoem(poem)
    let contributors;
    if (!showSkeleton) {
        contributors = poem.lines.filter(line => line.creator !== poem.creator)
            .map(line => line.creator === user.nickname ? 'you' : line.creator).filter(onlyUnique);
        if (contributors.length > 4) contributors = contributors.slice(0, 2).concat("...")

    }

    return <div className={"poem " + (canAddLineToPoem(poem, user) ? "poem-editable " : "")}>
        <div className="poem-title-con">
            {showSkeleton && <Skeleton width={titleLineWidth} className={"poem-title"}/>}
            {!showSkeleton && <h3 className="poem-title">{poem.title}</h3>}
            {!showSkeleton && <span className="small-boxy poem-title-creator">
                by {poem.creator === user.nickname ? <span className='personal'>you</span> : poem.creator}
                {contributors.length === 0 ? null : " feat. " + contributors.join(', ')}
            </span>}
        </div>
        <div className={"poem-main"}>
            {showSkeleton ? linesSkeletonArr :
                (poem.lines && poem.lines.map((line, index) =>
                    <Line key={"line-" + poem.id + index} line={line} authored={line.creator === user.nickname}/>
                ))}
            {(!showSkeleton && activeVoting === null && canAddLineToPoem(poem, user)) &&
            <LineInput poemId={poem.id} setPoem={setPoem}/>}
            {activeVoting !== null && <PoemVoting voting={activeVoting}/>}
        </div>

        {!showSkeleton && <PoemFooter user={user} poem={poem}/>}
    </div>
}

export default Poem
