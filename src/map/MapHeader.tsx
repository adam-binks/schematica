import { ActionIcon, CloseButton, Group, Paper, TextInput } from "@mantine/core"
import { IconCornerUpLeft, IconCornerUpRight } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { Map } from "../app/schema"
import { useBatchedTextInput } from "../etc/batchedTextInput"
import { redo, undo } from "../state/historyReducer"
import { renameMap } from "../state/mapFunctions"
import { closePane } from "../state/paneReducer"
import styles from "./MapHeader.module.css"

interface MapHeaderProps {
    map: Map
    paneIndex: number
    isOnlyPane: boolean
    divRef: React.RefObject<HTMLDivElement>
}
export default function MapHeader({ map, paneIndex, isOnlyPane, divRef }: MapHeaderProps) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    const history = useAppSelector(state => state.history[map.id])

    const batchedNameInput = useBatchedTextInput(
        map.name, 
        (value) => renameMap(firestore, dispatch, map.id, map.name, value)
    )

    return (
        <Paper
            ref={divRef}
            className={styles.MapHeader}
            shadow="md"
            p="xs"
            radius={0}
            onClick={(e: any) => e.stopPropagation()}
            onDoubleClick={(e: any) => e.stopPropagation()}
        >
            <Group position="apart" mx="md">
                <TextInput
                    variant="filled"
                    size="md"
                    value={batchedNameInput.value}
                    onChange={batchedNameInput.onChange}
                    onBlur={batchedNameInput.onBlur}
                    onFocus={batchedNameInput.onFocus}
                />
                {/* <Text size="xs" color="dimmed">
                    Map ID: {map.id}
                </Text> */}
                <Group>
                    <ActionIcon
                        title="Undo"
                        size="lg"
                        onClick={() => dispatch(undo(map.id))}
                        disabled={!history || (history.undo.length === 0)}
                    >
                        <IconCornerUpLeft />
                    </ActionIcon>
                    <ActionIcon
                        title="Redo"
                        size="lg"
                        onClick={() => dispatch(redo(map.id))}
                        disabled={!history || (history.redo.length === 0)}
                    >
                        <IconCornerUpRight />
                    </ActionIcon>
                    {!isOnlyPane ? <CloseButton
                        title="Close map"
                        onClick={() => dispatch(closePane(paneIndex))}
                        size="lg"
                    /> : <ActionIcon className="pointer-events-none"></ActionIcon>}
                </Group>
            </Group>
        </Paper>
    )
}