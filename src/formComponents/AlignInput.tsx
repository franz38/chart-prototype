import { AlignCenterVertical, AlignEndVertical, AlignStartVertical } from "lucide-react"

const style: React.CSSProperties = {
    cursor: "pointer",
    padding: 8
}
const iconAttributes = {
    size: 14,
    color: "rgba(0, 0, 0, 0.88)",
    style: style
}

export const AlignInput = () => {

    return <div style={{ display: "flex", width: "96px", height: "32px", borderRadius: "2px", border: "1px solid #eee" }}>
        <AlignStartVertical {...iconAttributes} />
        <AlignCenterVertical {...iconAttributes} />
        <AlignEndVertical {...iconAttributes} />
    </div>
}