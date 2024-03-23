
export const TemplateButton = (props: {
    onClick: () => void;
    text: string;
    img: string;
}) => {


    return <div className="demo-box cursor-pointer" onClick={() => props.onClick()}>
        <img src={props.img} className="object-cover object-center w-[240px] h-[150px] rounded-sm bg-[#d7d7d7] border-2 border-white"></img>
        <span className="block mt-1">{props.text}</span>
    </div>
}