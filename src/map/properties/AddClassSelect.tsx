import { clsx, Select } from "@mantine/core"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Arrow, Class, Element, elementType, Node, Schema } from "../../app/schema"
import { enact, enactAll } from "../../etc/firestoreHistory"
import { useSelectable } from "../../etc/useSelectable"
import { addClassToElementCommand, createNewClassAndAddToElementCommands, updateSchema } from "../../state/mapFunctions"
import { useMapId } from "../Map"

interface AddClassSelectProps {
    elementType: elementType
    element: Element | Class
    inSchema?: boolean
    showWhileEmpty: boolean
}
export function AddClassSelect({ elementType, element, inSchema, showWhileEmpty }: AddClassSelectProps) {
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const schema: Schema | undefined = useAppSelector(state => state.firestore.data.maps[mapId]?.schema)
    const { onMousedownSelectable } = useSelectable(element.id, elementType)

    const classId = inSchema ? element.id : (element as Node | Arrow).classId
    const theClass = inSchema ?
        element as Class :
        classId ? schema?.classes?.find(
            (cls: Class) => cls.id === classId
        ) : undefined
    if (elementType === "node" && classId && !theClass) {
        console.error(`Missing class with ID ${classId}`)
    }

    if (schema?.classes === undefined) {
        console.error("No schema.classes!")
        updateSchema(firestore, dispatch, mapId, "classes", schema, [])
    }

    return (
        <Select
            key="Select type"
            className={clsx(`doNotPan doNotZoom mx-auto`,
                elementType === "arrow" && "w-20",
            )}
            placeholder={`＋ Type`}
            searchable
            creatable
            nothingFound={`Name a new ${elementType} type`}
            value={classId}
            shadow="md"
            size="xs"
            data={
                (schema?.classes !== undefined) ? schema?.classes
                    .filter((cls: Class) => cls.element === elementType)
                    .map(
                        (theClass: Class) => ({
                            value: theClass.id,
                            label: theClass.name,
                            group: `Existing ${elementType} types`
                        })
                    ) : []
            }
            dropdownPosition="top"
            styles={(theme) => ({
                input: {
                    textAlign: "center",
                    padding: "0",
                    backgroundColor: theClass ? theClass.colour : "#fae6dd",
                    fontWeight: "bold",
                    outline: theClass ? `2px solid ${theClass.colour}` : "",
                    fontSize: `${((elementType === "arrow" || !theClass) ? 10 : 14)}px`,
                    ...(theClass === undefined ? {
                        minHeight: "10px",
                        lineHeight: "10px",
                        height: "20px",
                        marginBottom: "-5px",
                    } : {}),
                    visibility: (theClass || showWhileEmpty) ? "visible" : "hidden",
                },
                rightSection: {
                    display: "none",
                }
            })}
            pb={5}
            withinPortal
            radius="xl"
            variant="filled"
            getCreateLabel={(input) => `+ Create ${input}`}
            onCreate={(input) => {
                if (input) {
                    schema && !inSchema && enactAll(dispatch, mapId,
                        createNewClassAndAddToElementCommands(firestore, mapId, element as Element, elementType,
                            input, schema.classes)
                    )
                    return undefined
                }
            }}
            onChange={(newValue) => {
                if (newValue) {
                    const selectedClass = schema?.classes.find((cls: Class) => cls.id === newValue)
                    if (!selectedClass) {
                        console.error(`Missing class ${selectedClass}`)
                        return
                    }
                    schema && !inSchema && enact(dispatch, mapId,
                        addClassToElementCommand(firestore, mapId, element as Element, theClass, selectedClass)
                    )
                }
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDownCapture={(e) => {
                e.stopPropagation()
                onMousedownSelectable(e)
            }
            }
            onDoubleClick={(e) => e.stopPropagation()}
        />
    )
}