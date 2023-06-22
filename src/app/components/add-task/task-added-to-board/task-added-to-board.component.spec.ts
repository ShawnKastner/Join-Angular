import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAddedToBoardComponent } from './task-added-to-board.component';

describe('TaskAddedToBoardComponent', () => {
  let component: TaskAddedToBoardComponent;
  let fixture: ComponentFixture<TaskAddedToBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAddedToBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAddedToBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
