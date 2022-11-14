import { Card, Group } from "@mantine/core";
import { MouseEvent, useState } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useDebounce } from "use-lodash-debounce-throttle";
import { useAppDispatch } from "../../app/hooks";
import { Class } from "../../app/schema";
import { enact, enactAll } from "../../etc/firestoreHistory";
import { useSelectable } from "../../etc/useSelectable";
import { ItemTypes } from "../../ItemTypes";
import { updateClassCommand, updateSchemaPropertiesCommands } from "../../state/mapFunctions";
import { useNodesWithClass, useSchema } from "../../state/mapSelectors";
import { Editor } from "../editor/Editor";
import { Property } from "../editor/expose_properties";
import { useMapId } from "../Map";
import styles from "../node/Node.module.css";
import { NodeOverFlowMenu } from "../node/NodeOverflowMenu";
import { AddClassSelect } from "../properties/AddClassSelect";
import { ElementContext } from "../properties/useElementId";
import { PropertyStack } from "./PropertyStack";

 
export default function SchemaEntry({
    theClass
}: {
    theClass: Class
}) {
    const mapId = useMapId()
    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const classes: Class[] = useSchema((schema) => schema.classes)
    const nodesWithClass = useNodesWithClass(theClass.id, (nodesOfClass) => nodesOfClass)

    if (theClass.id === "") {
        console.error("Missing class!")
    }

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.SCHEMA_NODE,
            item: {
                id: theClass.id
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [theClass.id],
    )

    const { isSelected, onMousedownSelectable } = useSelectable(theClass.id, "class")

    const [isHovered, setIsHovered] = useState(false)

    const updateContent = (newValue: string) => enact(dispatch, mapId, updateClassCommand(
        firestore, mapId, classes, theClass.id,
        { content: newValue }
    ))

    const [properties, setProperties] = useState<Property[]>([])
    const updateProperties = useDebounce((newProperties: Property[]) => {
        if (properties !== newProperties) {
            enactAll(
                dispatch, 
                mapId, 
                updateSchemaPropertiesCommands(firestore, mapId, nodesWithClass, newProperties)
            )
            setProperties(newProperties)
        }
    }, 200)

    return (
        <ElementContext.Provider value={{ elementType: "class", elementId: theClass.id }}>
            <div
                className={`
                ${styles.nodeWrapper}
                ${styles.inSchema}
                ${isSelected ? styles.isSelected : ""}
                ${isHovered ? styles.isHovered : ""}
            `}
                id={`class.${theClass.id}`}
            >
                <AddClassSelect element={theClass} elementType={"class"} />

                <Card
                    shadow={isSelected ? "xl" : "xs"}
                    radius="md"
                    p="xs"
                    withBorder={true}
                    className={
                        `${styles.nodeCard}
                        ${isDragging ? styles.isDragging : ""}
                        doNotPan`
                    }
                    ref={drag}
                    onClick={(e: MouseEvent) => {
                        onMousedownSelectable(e)
                        e.stopPropagation()
                    }}
                    onDoubleClick={(e: MouseEvent) => e.stopPropagation()} // prevent this bubbling to map
                    onMouseEnter={() => { setIsHovered(true) }}
                    onMouseLeave={() => { setIsHovered(false) }}
                >
                    <Group className={styles.nodeControls} my={-8} position="right" spacing="xs">
                        <NodeOverFlowMenu node={undefined} theClass={theClass} />
                    </Group>

                    <Editor
                        element={theClass}
                        updateContent={updateContent}
                        onUpdateProperties={(newProperties) => updateProperties(newProperties)}
                    />

                    <PropertyStack theClass={theClass} />

                </Card>
            </div>
        </ElementContext.Provider>
    )
}