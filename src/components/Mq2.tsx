import {Alert, AlertIcon,Button, Flex, Stack, Box, HStack, VStack} from '@chakra-ui/react';
import {useRef,useState, useCallback,memo} from "react";
import { addStyles, EditableMathField } from 'react-mathquill';
import { MathComponent } from '../components/MathJax'
//se importa el componente hint desarrollado por Miguel Nahuelpan
import Hint from "../components/Hint";
import MQPostfixSolver from './MQPostfixSolver';
import MQPostfixparser from './MQPostfixparser';
addStyles();


const Mq2 =  ({step,test,setTest,cantidadDePasos,setDefaultIndex,setResumen}) => {
    let newtest=test;
    let entero= parseInt(step.stepId);

    //Mq1
    const [latex, setLatex] = useState("\\text{Ingresa tu respuesta aqui}");
    //inline style aprendido para componentes react en... https://codeburst.io/4-four-ways-to-style-react-components-ac6f323da822
    const EMFStyle ={
        width: "190px",
        maxHeight: "120px",
        marginBottom: "12px",
        border: "3px solid #73AD21"
    }
    const [ta,setTa] = useState();
    const [btnTxt, setBtnTxt] = useState("");
    const refBtnTxt = useRef(btnTxt);
    const [flag,setFlag] = useState(false);

    //hooks utilizados poara forzar el re-renderizado
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    //Inputsimple
    const [alerta,setAlerta] = useState("success");
    const [alertaMSG,setAlertaMSG] = useState("");
    const [alertaVisibility,setAlertaVisibility] = useState(true);
    
    //hook de miguel definido para los hints
    const [error, setError] = useState(false); //true when the student enters an incorrect answers

    //la siguiente funcion maneja la respuesta ingresada, la respuesta se compara con el valor correspondiente almacenado en el ejercicio.json
    //Ademas, se manejan los componentes de alerta utilizado en el componente padre(solver2) y el componente hijo(Mq2)
    //finalmente, se maneja la activacion del siguiente paso o resumen en caso de que la respuesta ingresada es correcta
    const handleAnswer = () => {
        newtest[entero].setRespuestaState(latex);
        let abc=newtest[entero].getRespuestaState();
        let cba=step.answers[0].answer[0]
        let compare = cba.localeCompare(abc)
        if (compare==0){
            setAlerta(()=>{return "success";});
            setAlertaMSG(()=>{return step.correctMsg;});
            setAlertaVisibility(()=>{return false;});
            newtest[entero].setStates({"disabled":false,"hidden":false,"answer":true});
            if (entero<cantidadDePasos-1) {
                newtest[entero+1].setStates({"disabled":false,"hidden":false,"answer":false});
                setDefaultIndex([entero+1]);
            } else {
                setResumen(()=>false);
            }
            newtest[entero].counter=newtest[entero].counter+1;
            //forceupdate();
        } else {
            setAlerta(()=>{return "error";});
            setAlertaMSG(()=>{return step.incorrectMsg;});
            setAlertaVisibility(()=>{return false;});
            setError(true);
        }
        setTest(()=>{return newtest;});
    }


    const refMQElement = (mathquill) => { 
        if (ta==undefined) {
            setTa(()=>{return mathquill});
        }
    }
    
    const something = () => {
        if(flag){
            ta.cmd(btnTxt);
            setFlag(()=>{return false})
        }
    }
    
    const hope = (prop) => {
        refBtnTxt.current=prop;
        btnTxt:refBtnTxt.current;
        setBtnTxt(refBtnTxt.current);
        forceUpdate()
    }

    //sin uso por efecto inesperado.
    const parentesis = () =>{
        setFlag(()=>{return true});
        hope("(");
    }

    const fraccion = () =>{
        setFlag(()=>{return true});
        hope(()=>{return "\\frac"});
        
    }

    const potencia = () =>{
        setFlag(()=>{return true});
        hope("^");
    }

    const raiz = () =>{
        setFlag(()=>{return true});
        hope("\\sqrt");
    }

    const clear = () =>{
        setFlag(()=>{return true});
        setLatex(()=>{return ""});
        if(ta!=undefined)ta.focus();
    }

    const prueba= () => {
        let exp=step.answers[0].answer[0];
        console.log("inicio parser")
        let parse=MQPostfixparser(exp);
        console.log(parse)
        console.log("fin parser, inicio solver")
        let answer = "";
        if (step.values != undefined) {
            console.log("valores: ", step.values)
            answer= MQPostfixSolver(parse.substring(0),step.values);
        } else {
            answer= MQPostfixSolver(parse.substring(0));
        }
        console.log("fin solver")
        return answer;
    }

    return (
        <>
            <VStack alignItems="center" justifyContent="center" margin={"auto"}>
                <Box>
                    <MathComponent tex={step.expression} display={true} />
                </Box>
                <Box>
                    <Stack spacing={4} direction='row' align='center' pb={4}>
                        {/*importante la distincion de onMouseDown vs onClick, con el evento onMouseDown aun no se pierde el foco del input*/}
                        <Button colorScheme='teal' onMouseDown={()=>{return fraccion()}}>/</Button>
                        <Button colorScheme='teal' onMouseDown={()=>{return raiz()}}>√</Button>
                        <Button colorScheme='teal' onMouseDown={()=>{return potencia()}}>^</Button>
                        <Button colorScheme='teal' onClick={()=>{return clear()}}>C</Button>
                    </Stack>
                    <HStack spacing='4px' alignItems="center" justifyContent="center" margin={"auto"}>
                        <Button colorScheme='teal' onMouseDown={(e)=>{e.preventDefault(); if(ta!=undefined)ta.keystroke('Left');}} size='xs'>L</Button>
                        <EditableMathField
                            key={"EMF"+entero}
                            latex={latex}
                            style={EMFStyle}
                            onChange={(mathField) => {
                                setLatex(()=>mathField.latex());
                                refMQElement(mathField);
                                }
                            }
                            onBlur={(e)=>{
                                    something();
                                }
                            }
                        >
                        </EditableMathField>
                        <Button colorScheme='teal' onMouseDown={(e)=>{e.preventDefault(); if(ta!=undefined)ta.keystroke('Right');}} size='xs'>R</Button>
                    </HStack>
                    </Box>
            </VStack>
            <HStack spacing='4px' alignItems="center" justifyContent="center" margin={"auto"}>
                    <Box>
                        <Button colorScheme='teal' height={"32px"} width={"88px"}onClick={()=>{handleAnswer();}}>Enviar</Button>
                    </Box>
                    <Hint
                        hints={step.hints}
                        //stepId={ejercicio.stepId}
                        contentId={3}
                        stepId={step.stepId}
                        matchingError={step.matchingError}
                        response={["response1","response2"]}
                        itemTitle="Factor Común compuesto "
                        error={error}
                        setError={setError}
                    ></Hint>
            </HStack>
            <Alert status={alerta} mt={2} hidden={alertaVisibility}>
                <AlertIcon />
                {alertaMSG}
            </Alert>
            <p>{latex}</p>
            <p>{step.answers[0].answer[0]}</p>
            <p>{prueba()}</p>
        </>
    )

}

export default memo(Mq2);