import { Flex, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const PresentacionEjercicios = () => {
    const router = useRouter()

    
    return (
        <Flex height="100vh"  alignItems="center" justifyContent="center">
            <Flex direction="column" background="gray.100" p={12} rounded={6}>
                <Heading onClick={() => router.push({pathname:"plain",query:{pid:"e1"},isReady:true})}>
                    fracciones1
                </Heading>
                <Heading onClick={() => router.push({pathname:"plain",query:{pid:"e2"},isReady:true})}>
                    fracciones2
                </Heading>
                <Heading onClick={() => router.push({pathname:"plain",query:{pid:"e3"},isReady:true})}>
                    potencias1
                </Heading>
                <Heading onClick={() => router.push({pathname:"plain",query:{pid:"e4"},isReady:true})}>
                    potencias2
                </Heading>
                <Heading onClick={() => router.push({pathname:"plain",query:{pid:"e5"},isReady:true})}>
                    potencias3
                </Heading>
                <Heading onClick={() => router.push({pathname:"plain",query:{pid:"e6"},isReady:true})}>
                    potencias4
                </Heading>
                <Heading onClick={() => router.push("plainpotato")}>
                    persistentpotato
                </Heading>
            </Flex> 
        </Flex>
    )
}

export default PresentacionEjercicios