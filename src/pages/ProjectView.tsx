import { Skeleton } from '@mantine/core';
import React, { useContext, useEffect } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { useParams } from "react-router-dom";
import { useAppSelector } from '../app/hooks';
import {Project, Recipe} from '../app/schema';
import Header from '../chrome/Header';
import Panes from '../map/Panes';
import { RecipePane } from '../map/recipe/RecipePane';

const ProjectContext = React.createContext<string>("")
export const useProjectId = () => useContext(ProjectContext)

export function ProjectView({passedProjectId}: {passedProjectId?: string}) {
    const firestore = useFirestore();
    const paramsId = useParams<{ projectId: string; }>().projectId;
    const projectId = passedProjectId || paramsId;
    const project = useAppSelector(state => projectId && state.firestore.data.projects?.[projectId]);

    useEffect(() => {
        firestore.setListener({
            collection: "projects",
            doc: projectId,
        });
    }, [projectId]);

    console.log("rendering project", {projectId, project})

    if (!project) { return <Skeleton />; }

    return (
        <ProjectContext.Provider value={passedProjectId || project?.id}>
            <div className="App text-center max-h-screen h-screen w-full flex flex-col">
                <Header project={project} />
                <Panes project={project} />
                <RecipePane />
            </div>
        </ProjectContext.Provider>
    );
}
