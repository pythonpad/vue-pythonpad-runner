import json

class JsonDrawer(object):
    def __init__(self, auto_flush=True):
        super().__init__()
        self.auto_flush = auto_flush
        self.task_queue = []

    def print(self, s):
        print(s)

    def print_dict(self, out_dict):
        self.print(out_dict)

    def flush(self):
        while self.task_queue:
            self.print_dict(self.task_queue.pop())

    def add_task(self, task_dict):
        if self.auto_flush:
            self.print_dict(task_dict)
        else:
            self.task_queue.append(task_dict)

    def on_create_canvas(self, canvas):
        canvas_dict = canvas.draw()
        self.add_task({
            'task': 'create_canvas',
            'canvas': canvas_dict,
        })

    def on_remove_canvas(self):
        self.add_task({
            'task': 'remove_canvas',
        })

    def on_edit_canvas(self, canvas):
        canvas_dict = canvas.draw()
        self.add_task({
            'task': 'edit_canvas',
            'canvas': canvas_dict,
        })

    def on_add(self, container, drawable):
        drawable_dict = drawable.draw()
        task_dict = {
            'task': 'add',
            'container_id': container.id,
            'drawable': drawable_dict,
        }
        self.add_task(task_dict)

    def on_remove(self, container, drawable):
        task_dict = {
            'task': 'remove',
            'container_id': container.id,
            'drawable_id': drawable.id,
        }
        self.add_task(task_dict)

    def on_edit(self, drawable):
        drawable_dict = drawable.draw()
        task_dict = {
            'task': 'edit',
            'drawable': drawable_dict,
        }
        self.add_task(task_dict)
