import React from "react";
import PoemsOverview from "./PoemsOverview";
import {useApi} from "../../helpers/api";

function ReadAllPoemsPage() {
    let {getPoems} = useApi();
    return <PoemsOverview getPoemsFunction={getPoems}/>
}

export default ReadAllPoemsPage;
