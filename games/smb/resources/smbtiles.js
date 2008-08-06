{
   // Frame (f): left, top, frameWidth, frameHeight
   // Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
   bitmapImage: "smbtiles.png",
   bitmapWidth: 320,
   bitmapHeight: 320,
   sprites: {
      "mario_stand": {
         "f" : [0, 0, 32, 32]
      },
      "mario_walk": {
         "a" : [32, 0, 32, 32, 3, 100, "loop"]
      },
      "mario_jump": {
         "f" : [0, 32, 32, 32]
      },
      "mario_skid": {
         "f" : [32, 32, 32, 32]
      },
      "mario_die": {
         "f" : [128, 32, 32, 32]
      },
      "super_stand": {
         "f" : [0, 64, 32, 64]
      },
      "super_walk": {
         "a" : [32, 64, 32, 64, 3, 150, "loop"]
      },
      "super_jump": {
         "f" : [0, 128, 32, 64]
      },
      "super_skid": {
         "f" : [32, 128, 32, 64]
      },
      "super_duck": {
         "f" : [128, 128, 32, 64]
      },
      "goomba": {
         "a" : [256, 96, 32, 32, 2, 500, "loop"]
      },
      "green_koopa": {
         "a" : [0, 192, 32, 64, 2, 500, "loop"]
      },
      "red_koopa": {
         "a" : [96, 192, 32, 64, 2, 500, "loop"]
      },
      "green_shell": {
         "f" : [64, 192, 32, 32]
      },
      "red_shell": {
         "f" : [64, 224, 32, 32]
      },
      "coin": {
         "a" : [128, 0, 32, 32, 4, 100, "loop"]
      },
      "q_block": {
         "a" : [160, 32, 32, 32, 3, 100, "toggle"]
      },
      "brick": {
         "f" : [160, 96, 32, 32]
      },
      "mushroom": {
         "f" : [160, 64, 32, 32]
      },
      "princess": {
         "f" : [128, 64, 32, 32]
      }
   }
}