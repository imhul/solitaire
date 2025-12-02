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
        this.#createDragEvents()
    }

    #createDiscardStack(): void {
        const discardStackXPos = topYPos + 100
        this.#drawCardBox(discardStackXPos, topYPos)
        this.#discardStack = []
        const bottomCard = this.#createCard(discardStackXPos, topYPos, true).setVisible(false)
        const topCard = this.#createCard(discardStackXPos, topYPos, true).setVisible(false)
        this.#discardStack.push(bottomCard, topCard)
    }

    #createCard(
        x: number,
        y: number,
        draggable: boolean,
        cardIndex?: number,
        stackIndex?: number
    ): Phaser.GameObjects.Image {
        return this.add
            .image(x, y, 'cards', backFrame)
            .setOrigin(0, 0)
            .setScale(cardScale)
            .setInteractive({ draggable })
            .setData({
                x,
                y,
                cardIndex,
                stackIndex,
            })
    }

    #createDrawStack(): void {
        this.#drawCardBox(topYPos, topYPos)
        this.#drawCardStack = []
        for (let i = 0; i < 3; i++) {
            this.#drawCardStack.push(
                this.#createCard(topYPos + i * 5, topYPos, false)
            )
        }
    }

    #createBaseBoard(): void {
        this.#baseStack = []
        baseStackPlaces.forEach((xPos) => {
            this.#drawCardBox(xPos, topYPos)
            const card = this.#createCard(xPos, topYPos, false).setVisible(false)
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
                const card = this.#createCard(0, j * 20, true, j, i)
                container.add(card)
            }
        })
    }

    #createDragEvents(): void {
        this.input.on(Phaser.Input.Events.DRAG_START, (
            pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.Image
        ): void => {
            gameObject.setData({ x: gameObject.x, y: gameObject.y })
            const stackIndex = gameObject.data.get('stackIndex') as number | undefined
            if (stackIndex === undefined) {
                gameObject.setDepth(2)
            } else {
                this.#playingStack[stackIndex].setDepth(2)
            }

            gameObject.setScale(cardScale * 1.1)
        })

        this.input.on(Phaser.Input.Events.DRAG, (
            pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.Image,
            dragX: number,
            dragY: number
        ): void => {
            const cardIndex = gameObject.data.get('cardIndex') as number
            const stackIndex = gameObject.data.get('stackIndex') as number | undefined

            if (stackIndex !== undefined) {
                const cardsToMove = this.#getCardsToMove(cardIndex, stackIndex)
                for (let i = 1; i <= cardsToMove; i++) {
                    const movingCard = this.#playingStack[stackIndex].list[cardIndex + i] as Phaser.GameObjects.Image
                    movingCard.setPosition(
                        dragX,
                        dragY + i * 20
                    )
                }
            }

            gameObject.setPosition(dragX, dragY)
        })

        this.input.on(Phaser.Input.Events.DRAG_END, (
            pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.Image
        ): void => {
            const cardIndex = gameObject.data.get('cardIndex') as number
            const stackIndex = gameObject.data.get('stackIndex') as number | undefined
            if (stackIndex === undefined) {
                gameObject.setDepth(0)
            } else {
                this.#playingStack[stackIndex].setDepth(0)
                const cardsToMove = this.#getCardsToMove(cardIndex, stackIndex)
                for (let i = 1; i <= cardsToMove; i++) {
                    const movingCard = this.#playingStack[stackIndex].list[cardIndex + i] as Phaser.GameObjects.Image
                    movingCard.setPosition(
                        movingCard.data.get('x') as number,
                        movingCard.data.get('y') as number
                    )
                }
            }

            gameObject.setScale(cardScale)
            gameObject.setPosition(
                gameObject.data.get('x') as number,
                gameObject.data.get('y') as number
            )
        })
    }

    #getCardsToMove(cardIndex: number, stackIndex: number): number {
        if (stackIndex === undefined) return 0

        const lastIndex = this.#playingStack[stackIndex].length - 1
        return lastIndex - cardIndex
    }
}
