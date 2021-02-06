import React from "react";
import PoemsOverview from "./PoemsOverview";
import {useApi} from "../../helpers/api";

function MyPoemsPage() {
    return <PoemsOverview getPoemsFunction={useApi().getUserPoems}/>
}

export default MyPoemsPage;
