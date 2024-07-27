export class Ad {
    constructor(
      public id: number,
      public title: string,
      public imageUrl: string | null,
      public videoUrl: string | null,
      public description: string
    ) {}
  }
  