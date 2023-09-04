import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ProdutoDto } from "@gerencial/dtos";
import { ProdutoCategoriaEnumMapper } from "@gerencial/types";

@Entity("Produto")
export class ProdutoModel {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    nome?: string;

    @Column({
        type: "varchar",
        length: 500,
        nullable: true
    })
    descricao?: string;

    @Column({
        type: "text",
        nullable: true
    })
    imagem?: string;

    @Column({
        type: "float",
        nullable: false
    })
    valor?: number;

    @Column({
        nullable: false
    })
    categoria?: string;

    constructor(produto?: ProdutoDto){
        if(produto){
            if(produto.id){
                this.id = produto.id;
            }
            this.nome = produto.nome;
            this.descricao = produto.descricao;
            this.valor = produto.valor;
            this.imagem = produto.imagem;

            if(produto.categoria) {
                this.categoria = ProdutoCategoriaEnumMapper.enumParaString(produto.categoria);
            }
        }
    }

    public getProdutoDto(): ProdutoDto {
        return new ProdutoDto(this.id, this.nome, this.descricao, this.valor, ProdutoCategoriaEnumMapper.stringParaEnum(this.categoria), this.imagem);
    }
}