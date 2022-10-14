import { useRouter } from 'next/router'
import { useState,memo} from 'react';

import { Flex, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Alert,Text,AlertIcon,HStack,VStack} from '@chakra-ui/react'
import { MathComponent } from '../components/MathJax'

//la siguiente linea se utiliza para el wraper del componente Mq, el cual usa la libreria JS mathquill
import dynamic from "next/dynamic";

const Solver2 = ({steps}) => {
    const Mq2 = dynamic(
        () => {
            return import("../components/Mq2");
        },
        { ssr: false }
    );

    //segun next api reference router y routing dynamic routes
    const router = useRouter();
    const { pid } = router.query;

    //const action=useAction();//send action to central system
    class passingPotato {
        private states = {
            "disabled":true,
            "hidden":false,
            "answer":false
        }

        private respuestaState;

        public counter=0;

        public getStates()
        {
            return this.states;
        }

        public setStates(a){
            this.states=a;
        }

        public getRespuestaState(){
            return this.respuestaState;
        }

        public setRespuestaState(a){
            this.respuestaState=a;
        }
    }

    const cantidadDePasos= steps.stepsQuantity;

    let potatoStates = [new passingPotato()];
    potatoStates[0].setStates({"disabled":false,"hidden":false,"answer":""});

    const [defaultIndex,setDefaultIndex]=useState([0]);

    for (let i=0; i< cantidadDePasos;i++) {
        potatoStates.push(new passingPotato());
    }
    
    const [test,setTest] = useState(potatoStates);  
    const [resumen,setResumen]= useState(true);

    const listaDePasos = steps.steps.map((step,i) => (
        <Mq2 
                key={"Mq2"+i}
                step={step}
                test={test}
                setTest={setTest}
                cantidadDePasos={cantidadDePasos}
                setDefaultIndex={setDefaultIndex}
                setResumen={setResumen}
            >
        </Mq2>
        )
    )
    const [pasos,setPasos]= useState(listaDePasos);

    return(
        <Flex height="100vh"  alignItems="center" justifyContent="center" margin={"auto"}>
            <Flex direction="column" background="gray.100" p={12} rounded={6} w='100%' maxW='3xl' alignItems="center" justifyContent="center" margin={"auto"}>
                <Heading as='h1' size='lg' noOfLines={1}>{pid}</Heading>
                <Heading as='h1' size='lg' noOfLines={3}>{steps.itemTitle}</Heading>
                <Heading as='h5' size='sm' mt={2}>{steps.text}</Heading>
                <MathComponent tex={steps.expression} display={true} />
                <Accordion
                    onChange={(algo)=>setDefaultIndex(algo)}
                    index={defaultIndex}
                    allowToggle
                    allowMultiple
                >
                    {steps.steps.map((step,i) => (
                    <AccordionItem
                    key={"AccordionItem"+i} 
                    isDisabled={test[parseInt(step.stepId)].getStates().disabled}
                    hidden={test[parseInt(step.stepId)].getStates().hidden}
                    >
                        <h2 key={"AIh2"+i}>
                        <Alert key={"AIAlert"+i} status={test[parseInt(step.stepId)].getStates().answer ? "success" : "info"}>
                            <AlertIcon key={"AIAlertIcon"+i}  />
                            <AccordionButton key={"AIAccordionButton"+i} >
                                <Box key={"AIBox"+i}flex='1' textAlign='left'>
                                Paso {step.stepId}: {step.stepTitle}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </Alert>
                        </h2>
                        <AccordionPanel key={"AIAccordionPanel"+i} pb={4}  >
                        {/*En el siguiente elemento es un estado que almacena el componente que maneja el paso del ejercicio correspondiente*/}
                        {pasos[i]}
                        </AccordionPanel>
                    </AccordionItem>
                    ))
                    }
                </Accordion>
                <Box>
                    <Alert status="info" hidden={resumen} alignItems='top'>
                    <AlertIcon />
                        <VStack  w="100%" align="left">
                            <Heading fontSize="xl" align="center">
                                Resumen
                            </Heading>
                            <HStack>
                                <Text >
                                    Expresión:
                                </Text>
                                <MathComponent
                                        tex={steps.expression}
                                        display={true}
                                />
                            </HStack>
                            {steps.steps.map( (step,i) =>(
                                        <Box key={"ResumenBox"+i}>
                                            <Text key={"ResumenText"+i} w="100%" justifyContent={"space-between"}>{step.summary}</Text>
                                            <MathComponent
                                                key={"ResumenMC"+i}
                                                tex={step.displayResult[0]}
                                                display={true}
                                            />
                                        </Box>
                                    )
                                )
                            }
                        </VStack>
                    </Alert>
                </Box>
            </Flex>
        </Flex>
    )
} 

export default memo(Solver2)