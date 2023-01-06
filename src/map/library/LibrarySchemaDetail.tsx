import { ActionIcon, Button, Textarea } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { sample } from "lodash"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Class, LibrarySchema } from "../../app/schema"
import { useBatchedTextInput } from "../../etc/batchedTextInput"
import { enact } from "../../etc/firestoreHistory"
import { generateId } from "../../etc/helpers"
import { createLibraryClassAndAddToSchema, deleteLibrarySchema, updateLibrarySchema } from "../../state/libraryFunctions"
import { createClassesCommand } from "../../state/mapFunctions"
import { useSchema } from "../../state/mapSelectors"
import { ELEMENT_COLOURS } from "../element/ColourPicker"
import { useMapId } from "../Map"
import SchemaEntry from "../schema/SchemaEntry"

export function LibrarySchemaDetail({
    librarySchema,
    classes,
    closeDetail,
}: {
    librarySchema: LibrarySchema
    classes: { [key: string]: Class }
    closeDetail: () => void
}) {
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const firestore = useFirestore()

    const editable = true // TODO restrict to owner

    const thisLibrarySchemaClasses = librarySchema.classIds.map((classId) => classes[classId])

    const classesInMapSchema: Class[] = useSchema(schema => schema.classes)

    const classesNotAdded: Class[] = thisLibrarySchemaClasses.filter(cls => !classesInMapSchema.some(c => c.name === cls.name))

    const batchedNameInput = useBatchedTextInput(
        librarySchema.name,
        (newName) => updateLibrarySchema(firestore, { id: librarySchema.id, name: newName })
    )

    const batchedDescriptionInput = useBatchedTextInput(
        librarySchema.description,
        (newDescription) => updateLibrarySchema(firestore, { id: librarySchema.id, description: newDescription })
    )

    return (
        <div className="absolute right-10 top-20 z-40 bg-slate-400 w-60 m-auto 
            text-white rounded-lg py-6 px-4 text-left text-sm flex flex-col overflow-auto"
            style={{maxHeight: "calc(100% - 90px)"}}>
            {editable ?
                <Textarea
                    autosize
                    size="lg"
                    mb={5}
                    styles={{
                        input: {
                            background: "transparent",
                            border: "none",
                            color: "white",
                            padding: 0,
                            fontWeight: "bolder",
                        },
                    }}
                    value={batchedNameInput.value}
                    onChange={batchedNameInput.onChange}
                    onBlur={batchedNameInput.onBlur}
                    onFocus={batchedNameInput.onFocus}
                />
                :
                <h3
                    className="font-bold pb-2 text-lg"
                >{librarySchema.name}</h3>
            }

            {editable ?
                <Textarea
                    autosize
                    className="opacity-80 bg-transparent"
                    value={batchedDescriptionInput.value}
                    onChange={batchedDescriptionInput.onChange}
                    onBlur={batchedDescriptionInput.onBlur}
                    onFocus={batchedDescriptionInput.onFocus}
                />
                :
                <p className="opacity-80">{librarySchema.description}</p>
            }

            <div className="flex flex-col space-y-2 mt-4">
                <h4 className="font-bold text-center">Schema</h4>
                {thisLibrarySchemaClasses.map((theClass) =>
                    theClass ?
                        <div key={theClass.id} className="m-auto flex">
                            <SchemaEntry key={theClass.id} inLibrary={true} theClass={theClass} editable={editable} />
                            {editable && <ActionIcon color="white" onClick={() =>
                                updateLibrarySchema(firestore, {
                                    id: librarySchema.id,
                                    classIds: librarySchema.classIds.filter(id => id !== theClass.id)
                                })
                            }>
                                <IconTrash size={16} />
                            </ActionIcon>}
                        </div>
                        : <p>Error: missing class</p>
                )}
            </div>

            {classesNotAdded.length > 0 ?
                <>
                    <Button
                        className="bg-blue-500 m-auto mt-4"
                        variant="filled"
                        onClick={() => {
                            enact(dispatch, mapId, createClassesCommand(firestore, mapId,
                                classesNotAdded.map(cls => ({ ...cls, id: generateId() })),
                                classesInMapSchema
                            ))
                        }}
                    >
                        Add all to schema
                    </Button>
                    <p className="mx-4 mt-2 italic text-xs text-slate-200 text-center">Or drag individual classes into your schema</p>
                </>
                :
                librarySchema.classIds && librarySchema.classIds.length > 0 &&
                     <p className="opacity-80 m-auto mt-4">All classes added</p>
            }

            {editable &&
                <>
                    <Button className="bg-slate-500 m-auto mt-4" variant="filled" size="xs" onClick={() =>
                        createLibraryClassAndAddToSchema(firestore, librarySchema.id,
                            {
                                id: generateId(),
                                name: "New node type",
                                content: "",
                                element: "node",
                                colour: sample(ELEMENT_COLOURS.node) as string,
                            })
                    }>
                        Add node type
                    </Button>
                    <Button className="bg-slate-500 m-auto mt-4" variant="filled" size="xs" onClick={() =>
                        createLibraryClassAndAddToSchema(firestore, librarySchema.id,
                            {
                                id: generateId(),
                                name: "New arrow type",
                                content: "",
                                element: "arrow",
                                colour: sample(ELEMENT_COLOURS.arrow) as string,
                            })
                    }>
                        Add arrow type
                    </Button>
                    <Button
                        className="bg-red-500 m-auto mt-4"
                        variant="filled"
                        size="xs"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this schema?")) {
                                deleteLibrarySchema(firestore, librarySchema.id)
                                closeDetail()
                            }
                        }}
                    >
                        Delete schema
                    </Button>
                </>
            }
        </div>
    )
}