class NewPokemon{
    constructor(
        public readonly id: number, 
        public name: string,
        ){}

        public scream(){
            console.log(`NO QUIERO!!!`)
        }

        speak(){ //si pongo private solo podemos utilizarlo dentro de la clase
            console.log(`NO QUIERO HABLAR`)
        }
}



const MyDecorator=()=>{
    return (target: Function)=>{
        return NewPokemon
    }
}

@MyDecorator()
export class Pokemon{
    constructor(
        public readonly id: number, 
        public name: string,
        ){}

        public scream(){
            console.log(`${this.name.toUpperCase()}!!!`)
        }

        speak(){ //si pongo private solo podemos utilizarlo dentro de la clase
            console.log(`${this.name}, ${this.name}`)
        }
}

export const charmander = new Pokemon(4, "Charmander")
charmander.scream();
charmander.speak();

