import { Scene } from 'phaser'
// config
import {
    topYPos,
    cardScale,
    backFrame,
    cardWidth,
    cardHeight,
    middleYPos,
    playPlaces,
    baseStackPlaces,
} from '../../config'

export class Game extends Scene {
    #drawCardStack: Phaser.GameObjects.Image[]
    #discardStack: Phaser.GameObjects.Image[]
    #baseStack: Phaser.GameObjects.Image[]
    #playingStack: Phaser.GameObjects.Container[]

    constructor() {
        super('Game')
    }

    preload() {
        this.load.setPath('assets')
        this.load.spritesheet('cards', 'cards.png', {
            frameWidth: cardWidth,
            frameHeight: cardHeight,
        })
    }

    create(): void {
        this.#createDrawStack()
        this.#createDiscardStack()
        this.#createBaseBoard()
        this.#createPlayingBoard()
    }

    #createDiscardStack(): void {
        const discardStackXPos = topYPos + 100
        this.#drawCardBox(discardStackXPos, topYPos)
        this.#discardStack = []
        const bottomCard = this.#createCard(discardStackXPos, topYPos).setVisible(false)
        const topCard = this.#createCard(discardStackXPos, topYPos).setVisible(false)
        this.#discardStack.push(bottomCard, topCard)
    }

    #createCard(x: number, y: number): Phaser.GameObjects.Image {
        return this.add
            .image(x, y, 'cards', backFrame)
            .setOrigin(0, 0)
            .setScale(cardScale)
    }

    #createDrawStack(): void {
        this.#drawCardBox(topYPos, topYPos)
        this.#drawCardStack = []
        for (let i = 0; i < 3; i++) {
            this.#drawCardStack.push(
                this.#createCard(topYPos + i * 5, topYPos)
            )
        }
    }

    #createBaseBoard(): void {
        this.#baseStack = []
        baseStackPlaces.forEach((xPos) => {
            this.#drawCardBox(xPos, topYPos)
            const card = this.#createCard(xPos, topYPos).setVisible(false)
            this.#baseStack.push(card)
        })
    }

    #drawCardBox(x: number, y: number): void {
        this.add
            .rectangle(
                x,
                y,
                cardWidth * cardScale,
                cardHeight * cardScale,
                0xffffff,
                0.2
            )
            .setOrigin(0)
            .setStrokeStyle(2, 0xffffff, 0.4)
    }

    #createPlayingBoard(): void {
        this.#playingStack = []
        playPlaces.forEach((xPos, i) => {
            this.#drawCardBox(xPos, middleYPos)
            const container = this.add.container(xPos, middleYPos)
            this.#playingStack.push(container)
            for (let j = 0; j < i + 1; j++) {
                const card = this.#createCard(0, j * 20)
                container.add(card)
            }
        })
    }
}
