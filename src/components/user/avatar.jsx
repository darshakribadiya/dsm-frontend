export function AvatarName({ name }) {
    return (
        <>{name.trim().split(/\s+/).map(word => word[0].toUpperCase()).join("")}</>
    )
}