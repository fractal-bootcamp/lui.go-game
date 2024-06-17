const App = () => {
    const [mode, setMode] = useState('solo')

    const {...} = useBoardController(mode)

    return <Board />

}

const SoloComponent = (props) => {

    
    return <div>
        <ToggleMode mode={props.mode} ... />
        <Board />
    </div>
}