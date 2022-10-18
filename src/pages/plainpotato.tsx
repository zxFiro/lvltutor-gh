import { Flex, Heading, Button, Input, HStack,Box } from '@chakra-ui/react'
import {useState, useEffect} from "react";
import localForage from "localforage";
import {useSnapshot } from 'valtio';
import state,{setState} from "../components/Proxywvaltio";
import { useCookies } from 'react-cookie';
import MQPostfixparser from '../components/MQPostfixparser';
import MQPostfixSolver from '../components/MQPostfixSolver';


const Plainpotato = () => {
    //con react-cookie
    const [cookies, setCookie] = useCookies(['cookie']);

    const changeCookie = (event) => {
        setCookie('cookie', [{cookie:event.target.value}], { path: '/' });
    }
    
    //con localStorage    
    const [potatoes,setPotatoes]=useState([{potato:"inicial"}]);

    useEffect(() => {
        const localPotato = localStorage.getItem("mypotato");
        setPotatoes(localPotato ? JSON.parse(localPotato) : [{potato:"inicial"}])
      }, []);

    useEffect(()=>{
        const fixLaggedStated = potatoes[0].potato;
        fixLaggedStated!="inicial" ? localStorage.setItem("mypotato",JSON.stringify(potatoes)):console.log("hmmm");
    },[potatoes]);

    const changePotato = (event) => {
        setPotatoes([{potato:event.target.value}]);
    };

    //con localForage
    const [wlF,setWlF]=useState([{localforage:"inicial"}]);

    useEffect(()=>{
        localForage.getItem('wlF', function (err, value) {
            // if err is non-null, we got an error. otherwise, value is the value
            if (err==null) {
                const foraging = value;
                foraging!=undefined ?setWlF(value) : setWlF([{localforage:"inicialb"}]);
            } else {
                setWlF([{localforage:"inicial"}])
            }
        });
    },[]);

    useEffect(()=>{
        if(wlF[0].localforage!= undefined){
            if(wlF[0].localforage.localeCompare("inicial")!=0)
            {
                localForage.setItem('wlF', wlF, function (err) {
                    console.log(err)
                    // if err is non-null, we got an error
                    if (err==null) {
                        
                    }
                });
            }
        }
    },[wlF]);

    
    const changeWlF = (event) => {
        const wlf = [{localforage:event.target.value}]
        setWlF(wlf);
    };

    //con valtio
    const snap = useSnapshot(state);

    const [iv,setIv]=useState("");

    useEffect(()=>{
        localForage.getItem('wvaltio', function (err, value) {
            // if err is non-null, we got an error. otherwise, value is the value
            if (err==null) {
                const foraging = value;
                foraging!=undefined ?setIv(value) : setIv("inicial");
            } else {
                setIv("inicial")
            }
        });
    },[]);



    const changeWvaltio = (event) => {
        //console.log(event.target.value)
        setState(event.target.value);
    }

    const operador = (a) => {
        var prueba;
        var busqueda;
        const sf=[];
        switch(a[0]){
            case '^':
                prueba="potencia";
                break;
            case '\\':
                busqueda=a.indexOf("\\frac")
                
                prueba="funcion: "+busqueda+" "+a[busqueda+5];
                break;
            case '+' || '-':
                prueba="suma/resta";
                break;
            default:
                prueba="nope: "+a.indexOf("\\frac");
        }
        return prueba;
    }

    const pruebaString = () => {
        var a = "\\frac{a^2}{b}";

        console.log(operador(a),operador(a),operador(a),a)
        return a[0]+a[1]+a.length;
    }

    const reservedWords = {
        "\\sqrt":'sqrt',
        "\\cdot":'*',
        "\\frac":'/',
        "sin":'sin',
        "cos":'cos'
    }

    const precedense = {
        'sin':4,
        'cos':4,
        '^':3,
        '\\sqrt':3,
        '\\cdot':2,
        '\\frac':2,
        '+':1,
        '-':1
    }

    const vali = () => {
        //let a = MQPostfixparser("\\frac{\\left(\\frac{a}{b}+\\frac{c}{d}\\right)}{\\left(\\frac{a}{b}-\\frac{c}{d}\\right)}");
        //MQPostfixSolver(a,[{name:"a",value:1},{name:"b",value:2},{name:"c",value:3},{name:"d",value:4}]);
        let b = MQPostfixparser("\\left(3.5\\right)\\cdot\\left(10^{-4}\\right)\\cdot\\left(5\\right)\\cdot\\left(10^6\\right)\\cdot\\left(4\\right)\\cdot\\left(10^{-4}\\right)");
        MQPostfixSolver(b,[{name:"a",value:1},{name:"b",value:2}]);
        /*
        console.log("perueba: "+(1^2),precedense["^"],precedense["\\cdot"]);
        let c = MQPostfixparser("\\left(3.5\\right)\\cdot\\left(10^{-4}\\right)\\cdot\\left(5\\right)\\cdot\\left(10^6\\right)\\cdot\\left(4\\right)\\cdot\\left(10^{-4}\\right)");
        MQPostfixSolver(c,[]);
        let d = MQPostfixparser("\\left(2^{-3}-2^{-5}\\right)^{-2}");
        MQPostfixSolver(d,[]);
        let e = MQPostfixparser("\\frac{a^{3\\cdot b+9}\\cdot d^{3\\cdot b+6}}{a^{3\\cdot b}\\cdot d^6}");
        MQPostfixSolver(e,[{name:"a",value:1},{name:"b",value:2},{name:"d",value:3}]);
        let f = MQPostfixparser("\\frac{1}{\\sqrt{a}+\\sqrt{b}}\\cdot\\frac{\\sqrt{a}-\\sqrt{b}}{\\sqrt{a}-\\sqrt{b}}");
        MQPostfixSolver(f,[{name:"a",value:1},{name:"b",value:4}]);
        */
    }

    return (
        <Flex height="100vh"  alignItems="center" justifyContent="center">
            <HStack>
                <Box>
                    <Heading>
                        Cookies, {pruebaString()}
                    </Heading>
                    <Input onChange={changeCookie} defaultValue={cookies.cookie!=undefined ? cookies.cookie[0].cookie:"inicial"}/>
                    <Button onClick={()=>vali()}>S</Button>
                </Box>
                <Box>
                    <Heading>
                        LocalStorage
                    </Heading>
                    <Input onChange={changePotato} defaultValue={potatoes!=undefined ? potatoes[0].potato : "inicial"}/>
                    <Button>S</Button>
                </Box>
                <Box>
                    <Heading>
                        LocalForage
                    </Heading>
                    <Input onChange={changeWlF} defaultValue={wlF[0]!=undefined ? wlF[0].localforage: "inicial"}/>
                    <Button >S</Button>
                </Box>
                <Box>
                    <Heading>
                        Valtio+localForage
                    </Heading>
                    <Input onChange={changeWvaltio} defaultValue={iv}/>
                    <Button>S</Button>
                </Box>
            </HStack>
        </Flex>
    )
}
export default Plainpotato