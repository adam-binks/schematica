import { AbstractProperty, Property } from "../../common/mapActions";
import styles from "./Property.module.css"
import TextProperty from "./TextProperty";

interface PropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
}
export default function Property({ property, abstractProperty }: PropertyProps) {
    return (
        <div className={styles.Property}>
            {abstractProperty.type === "text" && 
                <TextProperty 
                    property={property}
                    abstractProperty={abstractProperty}
                />}
            {abstractProperty.type === "checkbox" && <p>Todo implement checkbox</p>}
        </div>
    )
}