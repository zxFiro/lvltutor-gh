import Solver2 from "../components/Solver2";
//remover los siguientes 6 importaciones cuando se implemente el fetch en getserversideprops, falta la url de la db con la query correspondiente
import ejercicio1 from "../tutor/fracciones/fracciones1.json";
import ejercicio2 from "../tutor/fracciones/fracciones2.json";
import ejercicio3 from "../tutor/potencias/potencias1.json";
import ejercicio4 from "../tutor/potencias/potencias2.json";
import ejercicio5 from "../tutor/potencias/potencias3.json";
import ejercicio6 from "../tutor/potencias/potencias4.json";


const Plain = ({steps}) => {
    return (
        <Solver2 steps={steps}></Solver2>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    //const router = useRouter();
    const pid  = await context.query.pid;

    class ejercicio{
        private e;
        public setE(a){
            this.e=a;
        }
        public getE(){
            return this.e;
        }
    }

    const ej= new ejercicio();

    switch(pid) {
        case "e1":
            ej.setE(ejercicio1);
            break;
        case "e2":
            ej.setE(ejercicio2);
            break;
        case "e3":
            ej.setE(ejercicio3);
            break;
        case "e4":
            ej.setE(ejercicio4);
            break;
        case "e5":
            ej.setE(ejercicio5);
            break;
        case "e6":
            ej.setE(ejercicio6);
            break;
        default:
            ej.setE(ejercicio1);
    } 

    //Agregar la url con la query a la db de manera segura aqui, eliminar el switch y clase de arriba
    //const res = await fetch(load)
    //const ejercicio = await res.json()

    return {
      props: {steps:ej.getE()[0]}, // will be passed to the page component as props
    }
}

export default Plain

