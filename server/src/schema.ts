import typegoose from "@typegoose/typegoose";
const { getModelForClass, prop } = typegoose
import { Schema } from "mongoose";

class Map {
    @prop({ required: true })
    public name!: String

    @prop({ required: true, ref: () => Node })
    public nodes!: typegoose.Ref<Node>[]

    @prop({ required: true, ref: () => MapSchema })
    public mapSchema!: typegoose.Ref<MapSchema>

    // todo node types, arrow types, group types
}
export const MapModel = getModelForClass(Map)

class MapSchema {
    @prop({ required: true, ref: () => AbstractProperty })
    properties!: typegoose.Ref<AbstractProperty>[]
}
export const MapSchemaModel = getModelForClass(MapSchema)

class AbstractProperty {
    @prop({ required: true })
    public name!: String
}

class Node {
    @prop({ required: true })
    public name!: String

    @prop({ required: true, ref: () => Property })
    public properties!: typegoose.Ref<Property>[]
}

class Property {
    @prop({ required: true, ref: () => AbstractProperty })
    public abstractProperty!: typegoose.Ref<AbstractProperty>

    // NB: because value is Mixed type, on value changed must call doc.markModified(path), passing the path to the Mixed type
    // https://mongoosejs.com/docs/schematypes.html#mixed
    @prop()
    public value?: { type: Schema.Types.Mixed }
}