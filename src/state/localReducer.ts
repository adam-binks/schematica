import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { shallowEqual } from "react-redux"
import { useAppSelector } from "../app/hooks"
import { Property } from "../map/editor/exposeProperties"

// This is for computed, shared state (not persisted to Firebase)

export type LocalMapState = {
    mapId: string,
    classes: LocalClass[],
    elements: LocalElement[],
}
export type LocalClass = {
    id: string,
    properties: Property[],
}
const getBlankClassPartial = (): Partial<LocalClass> => ({ properties: [] })
export type LocalElement = LocalNode | LocalArrow
export type LocalNode = {
    id: string,
    elementType: "node",
    classId: string,
    properties: Property[],
    height: number,
    width: number,
    arrowDot: { x: number, y: number },
    propertyArrowDotHeights: { [property: string]: number },
}
export type LocalArrow = {
    id: string,
    elementType: "arrow",
    classId: string,
    properties: Property[],
    arrowDot: { x: number, y: number },
    propertyArrowDotHeights: { [property: string]: number },
}

export type LocalState = LocalMapState[]

const initialState: LocalState = []

const getOrCreateLocalMap = (state: LocalState, mapId: string): LocalMapState => {
    const localMap = state.find(localMap => localMap.mapId === mapId)
    if (localMap) {
        return localMap
    } else {
        const newLocalMap = { mapId, classes: [], elements: [] }
        state.push(newLocalMap)
        return newLocalMap
    }
}

export const localSlice = createSlice({
    name: 'local',
    initialState: initialState,
    reducers: {
        setLocalClass(state, action: PayloadAction<{ mapId: string, classId: string, class: Partial<LocalClass> }>) {
            const map = getOrCreateLocalMap(state, action.payload.mapId)
            const existingClass = map.classes.find(c => c.id === action.payload.classId)
            map.classes = map.classes.filter(c => c !== existingClass)
            map.classes.push({ ...(existingClass || getBlankClassPartial()), ...action.payload.class } as LocalClass)
        },
        setLocalElement(state, action: PayloadAction<{ mapId: string, elementId: string, element: Partial<LocalElement> }>) {
            const map = getOrCreateLocalMap(state, action.payload.mapId)
            const existingElement = map.elements.find(e => e.id === action.payload.elementId)
            map.elements = map.elements.filter(e => e !== existingElement)
            map.elements.push({ ...(existingElement || { id: action.payload.elementId }), ...action.payload.element } as LocalElement)
        },
        setPropertyArrowDotHeight(state, action: PayloadAction<{ mapId: string, elementId: string, property: string, height: number }>) {
            const map = getOrCreateLocalMap(state, action.payload.mapId)
            const existingElement = map.elements.find(e => e.id === action.payload.elementId)
            map.elements = map.elements.filter(e => e !== existingElement)
            map.elements.push({
                ...(existingElement || { id: action.payload.elementId }),
                propertyArrowDotHeights: {
                    ...(existingElement?.propertyArrowDotHeights || {}),
                    [action.payload.property]: action.payload.height,
                },
            } as LocalElement)
        }
    }
})
export const { setLocalClass, setLocalElement, setPropertyArrowDotHeight } = localSlice.actions


export const useLocalClass = (mapId: string, classId: string): LocalClass | undefined =>
    useAppSelector(state =>
        state.local.find((map: LocalMapState) => map.mapId === mapId)?.classes.find((c: LocalClass) => c.id === classId)
    )

export const useClassProperties = (mapId: string, classId: string | null): Property[] =>
    useAppSelector(state =>
        classId ? (
            state.local.find((map: LocalMapState) => map.mapId === mapId)?.classes.find((c: LocalClass) => c.id === classId)?.properties || []
        ) : [],
        shallowEqual
    )

export const useLocalElement = (mapId: string, elementId: string, selector: (element: LocalElement | undefined) => any): any =>
    useAppSelector(state =>
        selector(state.local.find((map: LocalMapState) => map.mapId === mapId)?.elements.find((e: LocalElement) => e.id === elementId))
    )

export default localSlice.reducer